import React from 'react'
import { FiLogIn } from 'react-icons/fi'
import logoImg from '../../assets/logo.svg'

import { Container, Content, Background } from './styles'

const SingIn: React.FC = () => (
  <>
    <Container>
      <Content>
        <img src={logoImg} alt="GoBarber" />

        <form>
          <h1>Faça seu Logon</h1>

          <input placeholder="E-mail" />
          <input placeholder="Senha" type="password" />

          <button type="submit">Entrar</button>

          <a href="forgot">Esqueci minha senha</a>
        </form>

        <a href="login">
          <FiLogIn />
          Criar Conta
        </a>
      </Content>
      <Background />
    </Container>
  </>
)

export default SingIn
