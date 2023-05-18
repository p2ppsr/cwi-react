import React from 'react'
import { Tooltip, Typography } from '@mui/material'
import Whatsonchain from 'whatsonchain'

const EXCHANGE_RATE_UPDATE_INTERVAL = 5 * 60 * 1000

const localeDefault = Intl.NumberFormat().resolvedOptions().locale
const groupDefault = Intl.NumberFormat().formatToParts(1234.56).filter(p => p.type === 'group')[0].value
const decimalDefault = Intl.NumberFormat().formatToParts(1234.56).filter(p => p.type === 'decimal')[0].value

const satoshisOptions = {
  fiatFormats: [
    {
      // value suitable as first arg for Intl.NumberFormat or null for default locale
      locale: 'en-US',
      // value suitable as currency property of second arg for Intl.NumberFormat, currently only 'USD' is supported
      currency: 'USD'
    },
    {
      locale: null,
      currency: 'USD'
    },
  ],
  satsFormats: [
    {
      // One of: 'SATS', 'BSV', 'mBSV'
      // 100,000,000 SATS === 1000 mBSV === 1 BSV
      unit: 'SATS',
      // string to insert between integer and fraction parts, null for locale default
      decimal: null,
      // string to insert every three digits from decimal, null for locale default
      group: null,
      // full unit label
      label: 'satoshis',
      // abbreviated unit label
      abbrev: 'sats'
    },
    {
      unit: 'SATS',
      decimal: '.',
      group: '_',
      label: 'satoshis',
      abbrev: 'sats'
    },
    {
      unit: 'mBSV',
      decimal: null,
      group: null,
      label: 'mBSV',
      abbrev: ''
    },
    {
      unit: 'mBSV',
      decimal: '.',
      group: '_',
      label: 'mBSV',
      abbrev: ''
    },
    {
      unit: 'BSV',
      decimal: null,
      group: null,
      label: 'BSV',
      abbrev: ''
    },
    {
      unit: 'BSV',
      decimal: '.',
      group: '_',
      label: 'BSV',
      abbrev: ''
    },
  ],
  isFiatPreferred: false // If true, fiat format is preferred, else satsFormat
}

export const formatSatoshisAsUSD = (
  satoshis = NaN,
  satoshisPerUSD = null,
  format = null
) => {

  format ??= satoshisOptions.fiatFormats[0]
  const locale = format.locale ?? localeDefault

  const usd = (satoshisPerUSD && Number.isInteger(Number(satoshis))) ? satoshis / satoshisPerUSD : NaN
  const usdFormat = new Intl.NumberFormat(locale, { currency: 'USD', style: 'currency'})

  return (usd === NaN)
    ? '...'
    : (Math.abs(usd) >= 1)
      ? usdFormat.format(usd)
      : `${(usd * 100).toFixed(3)} ¢`
}

export const formatSatoshis = (
  satoshis,
  showPlus = false,
  abbreviate = false,
  format = null
) => {
  format ??= satoshisOptions.satsFormats[0]
  let s = (Number.isInteger(Number(satoshis))) ? Number(satoshis) : null
  if (s === null)
    return '---'
  const sign = s < 0 ? '-' : showPlus ? '+' : ''
  s = Math.abs(s).toFixed(0)
  // There are at most 21 some odd million hundred million satoshis.
  // We format this with the following separators.
  // Note that the decimal only appears after a hundred million satoshis.
  // 21_000_000.000_000_00
  const g = format.group ?? groupDefault
  const d = format.decimal ?? decimalDefault
  let p, sMinLen
  switch (format.unit) {
    case 'BSV': sMinLen = 9; p = [[2,g],[3,g],[3,d],[3,g],[3,g]]; break
    case 'mBSV': sMinLen = 6; p = [[2,g],[3,d],[3,g],[3,g],[3,g]]; break
    default:
    case 'SATS': sMinLen = 0; p = [[3,g],[3,g],[3,g],[3,g],[3,g]]; break
  }
  let r = ''
  while (s.length < sMinLen) s = '0' + s
  while (s.length > 0) {
    if (p.length == 0) {
      r = s + r
      s = ''
    } else {
      const q = p.shift()
      r = s.substring(s.length - q[0]) + r
      if (s.length > q[0]) {
        r = q[1] + r
        s = s.substring(0, s.length - q[0])
      } else {
        s = ''
      }
    }
  }
  r = `${sign}${r}`
  const label = abbreviate ? format.abbrev : format.label
  if (label && label.length > 0)
    r = `${r} ${label}`
  return r
}

const ExchangeRateContext = React.createContext({
  satoshisPerUSD: NaN,
  whenUpdated: null,
  isFiatPreferred: false,
  fiatFormatIndex: 0,
  satsFormatIndex: 0
})

export const useExchangeRateContext = () => React.useContext(ExchangeRateContext)

export class ExchangeRateContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.children = props.children

    this.toggleIsFiatPreferred = () => {
      this.setState(oldState => ({isFiatPreferred: !oldState.isFiatPreferred}))
    }

    this.cycleFiatFormat = () => {
      this.setState(oldState => ({fiatFormatIndex: oldState.fiatFormatIndex + 1}))
    }

    this.cycleSatsFormat = () => {
      this.setState(oldState => ({satsFormatIndex: oldState.satsFormatIndex + 1}))
    }

    this.state = {
      satoshisPerUSD: NaN,
      whenUpdated: null,
      isFiatPreferred: false,
      fiatFormatIndex: 0,
      satsFormatIndex: 0,
      toggleIsFiatPreferred: this.toggleIsFiatPreferred,
      cycleFiatFormat: this.cycleFiatFormat,
      cycleSatsFormat: this.cycleSatsFormat
    }
    this.woc = new Whatsonchain()
  }

  componentDidMount() {
    this.tick()
  }

  componentWillUnmount() {
    clearTimeout(this.timerID)
  }

  async tick() {
    let rate = await this.woc.exchangeRate()
    let satoshisPerUSD = 100000000 / rate.rate
    this.setState({ satoshisPerUSD: satoshisPerUSD, whenUpdated: new Date() })
    //console.log(`Exchange rate udpated: ${this.state.whenUpdated.toISOString()} ${rate.rate}`)
    this.timerID = setTimeout(() => this.tick(), EXCHANGE_RATE_UPDATE_INTERVAL)
  }

  render() {
    return (
      <ExchangeRateContext.Provider value ={this.state}>
        {this.children}
      </ExchangeRateContext.Provider>
    )
  }
}

export class Satoshis extends React.Component {
  constructor(props) {
    super(props)
    this.abbreviate = !!props.abbreviate
    this.showPlus = !!props.showPlus
    this.satoshis = (Number.isInteger(Number(props.children))) ? this.satoshis = Number(props.children) : NaN
    this.formattedSatoshis = (this.satoshis !== NaN) ? formatSatoshis(this.satoshis, this.showPlus, this.abbreviate) : '...'
    this.state = { formattedFiatAmount: '...' }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.children !== this.props.children || prevProps.showPlus !== this.props.showPlus || prevProps.abbreviate !== this.props.abbreviate) {
      // Update the component when the relevant props change
      this.abbreviate = !!this.props.abbreviate
      this.showPlus = !!this.props.showPlus
      this.satoshis = Number.isInteger(Number(this.props.children)) ? Number(this.props.children) : NaN
      this.formattedSatoshis = this.satoshis !== NaN ? formatSatoshis(this.satoshis, this.showPlus, this.abbreviate) : '...'

      // You can perform any additional computations or state updates here
      this.setState({ formattedFiatAmount: '...' })
    }
  }

  static contextType = ExchangeRateContext

  render() {
    const ctx = this.context
    const opts = satoshisOptions
    const fiatFormat = opts.fiatFormats[ctx.fiatFormatIndex % opts.fiatFormats.length]
    const satsFormat = opts.satsFormats[ctx.satsFormatIndex % opts.satsFormats.length]
    const formattedSatoshis = formatSatoshis(this.satoshis, this.showPlus, this.abbreviate, satsFormat)
    const formattedFiat = formatSatoshisAsUSD(this.satoshis, ctx.satoshisPerUSD, fiatFormat)
    return ctx.isFiatPreferred
      ? (
        <Tooltip interactive={true} title={<Typography color='inherit' onClick={ctx.toggleIsFiatPreferred}>{formattedSatoshis}</Typography>} arrow >
          <span onClick={ctx.cycleFiatFormat}>{formattedFiat}</span>
        </Tooltip>
      )
      : (
        <Tooltip interactive={true} title={<Typography color='inherit' onClick={ctx.toggleIsFiatPreferred}>{formattedFiat}</Typography>} arrow >
          <span onClick={ctx.cycleSatsFormat}>{formattedSatoshis}</span>
        </Tooltip>
      )
  }
}

export default Satoshis