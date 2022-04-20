import jwt_decode from 'jwt-decode'
import axios from 'axios'

class Authentication {
  getRole() {
    if (this.getToken() != null) {
      return this.encodeToken().authorities
    } else return false
  }

  getToken() {
    return localStorage.getItem('token')
  }

  removeUserCurrentlyLoggedIn() {
    localStorage.removeItem('token')
  }

  isUserLoggedIn() {
    return this.getToken()
  }

  encodeToken() {
    const token = this.getToken()
    var decoded = jwt_decode(token)
    return {
      iss: decoded.iss,
      exp: decoded.exp,
      iat: decoded.iat,
      authorities: decoded.authorities,
    }
  }

  isTokenExpired() {
    if (this.getToken() == null) {
      return true
    }
    const expireDate = this.encodeToken().exp
    const currentDateTime = Date.now().toString().slice(0, -3)

    return currentDateTime > expireDate
  }

  setToken(token) {
    localStorage.setItem('token', token)
  }

  refreshTokenIfExpired() {
    if (this.getToken() != null) {
      const expireDate = this.encodeToken().exp
      const currentDateTime = Date.now().toString().slice(0, -3)

      const jwtTotalSecoundsLeft = expireDate - parseInt(currentDateTime)

      const isRefreshRequired = jwtTotalSecoundsLeft <= 120

      if (isRefreshRequired) {
        this.refreshToken()
      }
    }
  }

  refreshToken() {
    axios.get('api/v1/authentication/token-refresh', {}).then(
      (response) => {
        this.setToken(response.data.authenticationToken)
      },
      (error) => {},
    )
  }
}

export default new Authentication()
