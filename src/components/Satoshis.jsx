import React from 'react'
import { Tooltip, Typography } from '@mui/material'
import Whatsonchain from 'whatsonchain'

const EXCHANGE_RATE_UPDATE_INTERVAL = 5 * 60 * 1000

const usdFormat = new Intl.NumberFormat('en-US', { currency: 'USD', style: 'currency'})

export const formatSatoshisAsUSD = (
  satoshis = NaN,
  satoshisPerUSD = null
) => {
  const usd = (satoshisPerUSD && Number.isInteger(Number(satoshis))) ? satoshis / satoshisPerUSD : NaN
  return (!Number(usd))
    ? '...'
    : (Math.abs(usd) >= 1)
      ? usdFormat.format(usd)
      : `${(usd * 100).toFixed(3)} ¢`
}

export const formatSatoshis = (
  satoshis,
  showPlus = false
) => {
  let s = (Number.isInteger(Number(satoshis))) ? Number(satoshis).toFixed(0) : null
  if (s === null)
    return '---'
  // There are at most 21 some odd million hundred million satoshis.
  // We format this with the following separators.
  // Note that the decimal only appears after a hundred million satoshis.
  // 21_000_000.000_000_00
  const p = [[2,'_'],[3,'_'],[3,'.'],[3,'_'],[3,'_']]
  let r = ''
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
  if (showPlus && satoshis > 0)
    r = `+${r}`
  return r
}

const ExchangeRateContext = React.createContext({
  satoshisPerUSD: NaN,
  whenUpdated: null
})

export const useExchangeRateContext = () => React.useContext(ExchangeRateContext)

export class ExchangeRateContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.children = props.children
    this.state = { satoshisPerUSD: NaN, whenUpdated: null }
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
    this.formattedSatoshis = (Number(this.satoshis)) ? formatSatoshis(this.satoshis, this.showPlus) : '...'
    this.state = { formattedFiatAmount: '...' }
  }

  static contextType = ExchangeRateContext

  render() {
    let satoshisPerUSD = this.context.satoshisPerUSD
    return (
      <Tooltip title={<Typography color='inherit'>{formatSatoshisAsUSD(this.satoshis, satoshisPerUSD)}</Typography>} arrow >
        <span>{this.formattedSatoshis}&nbsp;{this.abbreviate ? 'sats' : 'satoshis'}</span>
      </Tooltip>
    )
  }
}

export default Satoshis