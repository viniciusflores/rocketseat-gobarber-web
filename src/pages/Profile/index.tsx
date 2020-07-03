import React, { useCallback, useRef, FormEvent, ChangeEvent } from 'react'
import { FiUser, FiMail, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { useHistory, Link } from 'react-router-dom'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'

import api from '../../services/api'
import { useToast } from '../../hooks/toast'
import getValidationErrors from '../../util/getValidationsErrors'

import Button from '../../components/Button'
import Input from '../../components/Input'

import { Container, Content, AvatarInput } from './styles'
import { useAuth } from '../../hooks/auth'
import avatarUser from '../../assets/avatar.svg'

interface ProfileFormData {
  name: string
  email: string
  old_password: string
  password: string
  password_confirmation: string
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { addToast } = useToast()
  const history = useHistory()
  const { user, updateUser } = useAuth()

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({})

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), ''], 'Confirmação incorreta'),
        })

        await schema.validate(data, { abortEarly: false })

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        }

        const response = await api.put('/profile', formData)

        updateUser(response.data)

        history.push('/dashboard')

        addToast({
          type: 'success',
          title: 'Perfil atualizado!',
          description:
            'Suas informações do perfil foram atualizadas com sucesso',
        })
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err)

          formRef.current?.setErrors(errors)

          return
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização',
          description:
            'Ocorreu um erro ao fazer atualizar perfil, tente novamente.',
        })
      }
    },
    [addToast, history, updateUser],
  )

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData()
        data.append('avatar', e.target.files[0])

        api.patch('users/avatar', data).then(response => {
          updateUser(response.data)

          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          })
        })
      }
    },
    [addToast, updateUser],
  )

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard" data-cy="link-to-dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          onSubmit={handleSubmit}
          initialData={{
            name: user.name,
            email: user.email,
          }}
        >
          <AvatarInput>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} />
            ) : (
              <img src={avatarUser} alt={user.name} />
            )}
            <label htmlFor="avatar">
              <FiCamera />
              <input
                type="file"
                id="avatar"
                data-cy="avatar"
                onChange={handleAvatarChange}
              />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome" />
          <Input name="email" icon={FiMail} placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            placeholder="Senha atual"
            type="password"
          />

          <Input
            name="password"
            icon={FiLock}
            placeholder="Nova Senha"
            type="password"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            placeholder="Confirmar Senha"
            type="password"
          />

          <Button type="submit" dataTestId="btn-confirmar-mudanca">
            Confirmar mudanças
          </Button>
        </Form>
      </Content>
    </Container>
  )
}

export default Profile
