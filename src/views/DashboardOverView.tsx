import { Box, ContextView, Inline } from '@stripe/ui-extension-sdk/ui'
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client'
import Stripe from 'stripe'
import { useEffect, useState } from 'react'
import { TextField, Button } from '@stripe/ui-extension-sdk/ui'

const stripe: Stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient() as Stripe.HttpClient,
  apiVersion: '2020-08-27',
})

const DashboardOverView = ({
  userContext,
  environment,
}: ExtensionContextValue) => {
  const [pixelId, setPixelId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [testEventCode, setTestEventCode] = useState('')

  const [pixelIdSetStatus, setPixelIdSetStatus] = useState('')
  const [accessTokenSetStatus, setAccessTokenSetStatus] = useState('')
  const [testEventCodeSetStatus, setTestEventCodeSetStatus] = useState('')

  const setpixelaccess = () => {
    if ('' !== pixelId) {
      stripe.apps.secrets
        .create({
          scope: { type: 'account' },
          name: 'fb_pixel_id',
          payload: pixelId,
        })
        .then((resp) => setPixelIdSetStatus('New Pixel ID set!'))
    }

    if ('' !== accessToken) {
      stripe.apps.secrets
        .create({
          scope: { type: 'account' },
          name: 'fb_access_token',
          payload: accessToken,
        })
        .then((resp) => setAccessTokenSetStatus('New Access Token set!'))
    }

    if ('' !== testEventCode) {
      stripe.apps.secrets
        .create({
          scope: { type: 'account' },
          name: 'fb_test_event_code',
          payload: testEventCode,
        })
        .then((resp) => setTestEventCodeSetStatus('New Test Event Code set!'))
    }
  }

  return (
    <ContextView title="Setup FB API">
      <Box
        css={{
          background: 'container',
          borderRadius: 'medium',
          marginTop: 'small',
          padding: 'large',
          wordBreak: 'break-all',
        }}
      >
        <TextField
          label="Pixel ID"
          type="text"
          onChange={(e) => {
            setPixelId(e.target.value)
          }}
          defaultValue={pixelId}
        />
        <Inline css={{ font: 'body', color: 'red', fontWeight: 'semibold' }}>
          {pixelIdSetStatus}
        </Inline>
        <TextField
          label="Access Token"
          type="text"
          onChange={(e) => {
            setAccessToken(e.target.value)
          }}
          defaultValue={accessToken}
        />
        <Inline css={{ font: 'body', color: 'red', fontWeight: 'semibold' }}>
          {accessTokenSetStatus}
        </Inline>
        <TextField
          label="Test Event Code"
          type="text"
          onChange={(e) => {
            setTestEventCode(e.target.value)
          }}
          defaultValue={testEventCode}
        />
        <Inline css={{ font: 'body', color: 'red', fontWeight: 'semibold' }}>
          {testEventCodeSetStatus}
        </Inline>
        <Button
          type="primary"
          css={{
            marginTop: 'small',
            padding: 'medium',
          }}
          onClick={(e) => setpixelaccess()}
        >
          Set new Pixel Id & Access Token
        </Button>
      </Box>
    </ContextView>
  )
}

export default DashboardOverView
