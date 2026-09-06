import { Alert } from '@heroui/react'
import React from 'react'

export default function ErrorMessage({error}) {
  return (
    error && (
      <Alert status="danger" className="mt-1 mb-3 rounded-full bg-white">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>{error.message}</Alert.Title>
        </Alert.Content>
      </Alert>
    )
  )
}
