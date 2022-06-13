import {
  Box,
  Icon,
  Inline,
  Link,
  TextField,
  SettingsView,
} from '@stripe/ui-extension-sdk/ui'
import { useEffect, useState } from 'react'
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client'
import Stripe from 'stripe'

const stripe: Stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient() as Stripe.HttpClient,
  apiVersion: '2020-08-27',
})

const AppSettings = ({ userContext, environment }: ExtensionContextValue) => {
  const [status, setStatus] = useState('')

  // Define a callback function to pass to the onSave event.
  const saveSettings = async (values) => {
    setStatus('Saving...')
    const { pixelId, accessToken, testEventCode } = values

    if ('' !== pixelId) {
      stripe.apps.secrets
        .create({
          scope: { type: 'account' },
          name: 'fb_pixel_id',
          payload: pixelId,
        })
        .then((resp) => console.log('New Pixel ID set!'))
    }

    if ('' !== accessToken) {
      stripe.apps.secrets
        .create({
          scope: { type: 'account' },
          name: 'fb_access_token',
          payload: accessToken,
        })
        .then((resp) => console.log('New Access Token set!'))
    }

    if ('' !== testEventCode) {
      stripe.apps.secrets
        .create({
          scope: { type: 'account' },
          name: 'fb_test_event_code',
          payload: testEventCode,
        })
        .then((resp) => console.log('New Test Event Code set!'))
    }

    setStatus('Setting updated')
  }

  return (
    <SettingsView onSave={saveSettings} statusMessage={status}>
      <TextField name="pixelId" label="Pixel ID" />
      <TextField name="accessToken" label="Access Token" />
      <TextField name="testEventCode" label="Test Event Code" />
    </SettingsView>
  )
}

export default AppSettings
