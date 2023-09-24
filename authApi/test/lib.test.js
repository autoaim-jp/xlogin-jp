import lib from '../lib/index.js'

describe('addQueryStr', () => {
  it('expect 1: url ? queryStr', () => {
    const url = 'https://xlogin.jp/' 
    const queryStr = 'status=ok'
    const urlWithoutQueryAndQuery = lib.commonServerLib.addQueryStr(url, queryStr)
    expect(urlWithoutQueryAndQuery).toBe('https://xlogin.jp/?status=ok')
  })
  it('expect 2: url ? queryStr', () => {
    const url = 'https://xlogin.jp/' 
    const queryStr = 'status=ok&id=1234'
    const urlWithoutQueryAndQuery = lib.commonServerLib.addQueryStr(url, queryStr)
    expect(urlWithoutQueryAndQuery).toBe('https://xlogin.jp/?status=ok&id=1234')
  })

  it('expect 1: url?queryStr & queryStr', () => {
    const url = 'https://xlogin.jp/?message=hello'
    const queryStr = 'status=ok'
    const urlWithoutQueryAndQuery = lib.commonServerLib.addQueryStr(url, queryStr)
    expect(urlWithoutQueryAndQuery).toBe('https://xlogin.jp/?message=hello&status=ok')
  })
  it('expect 2: url?queryStr & queryStr', () => {
    const url = 'https://xlogin.jp/?message=hello'
    const queryStr = 'status=ok&id=1234'
    const urlWithoutQueryAndQuery = lib.commonServerLib.addQueryStr(url, queryStr)
    expect(urlWithoutQueryAndQuery).toBe('https://xlogin.jp/?message=hello&status=ok&id=1234')
  })

  it('expect: undefined & queryStr', () => {
    const url = undefined
    const queryStr = 'status=ok&id=1234'
    const urlWithoutQueryAndQuery = lib.commonServerLib.addQueryStr(url, queryStr)
    expect(urlWithoutQueryAndQuery).toBe('/error')
  })
})

