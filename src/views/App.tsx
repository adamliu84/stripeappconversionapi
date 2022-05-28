import { Box, ContextView, Inline, Link } from '@stripe/ui-extension-sdk/ui'
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { Button } from '@stripe/ui-extension-sdk/ui'
import { useState, useEffect } from 'react'
import BrandIcon from './brand_icon.svg'
import React from 'react'
import Stripe from 'stripe'
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client'

const stripe: Stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient() as Stripe.HttpClient,
  apiVersion: '2020-08-27',
})

const App = ({ userContext, environment }: ExtensionContextValue) => {
  const [sentStatus, setSentStatus] = useState('')
  const [sentCount, setSentCount] = useState(0)
  const [pixelId, setPixelId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [testEventCode, setTestEventCode] = useState('')

  useEffect(() => {
    stripe.apps.secrets
      .find({
        scope: { type: 'account' },
        name: 'fb_pixel_id',
        expand: ['payload'],
      })
      .then((resp) => setPixelId(resp.payload))

    stripe.apps.secrets
      .find({
        scope: { type: 'account' },
        name: 'fb_access_token',
        expand: ['payload'],
      })
      .then((resp) => setAccessToken(resp.payload))

    stripe.apps.secrets
      .find({
        scope: { type: 'account' },
        name: 'fb_test_event_code',
        expand: ['payload'],
      })
      .then((resp) => setTestEventCode(resp.payload))
  }, [])

  const makeConversionApi = async () => {
    //Placeholder to update with pixel_id and access_token
    const local_pixel_id = pixelId
    const local_access_token = accessToken
    const local_test_event_code = testEventCode
    //FB Graph URL
    const url = `https://graph.facebook.com/v12.0/${local_pixel_id}/events?data=%5B%7B%22action_source%22%3A%22website%22%2C%22event_id%22%3A12345%2C%22event_name%22%3A%22TestEvent%22%2C%22event_time%22%3A1653567322%2C%22user_data%22%3A%7B%22client_user_agent%22%3A%22Mozilla%2F5.0%20(iPhone%3B%20CPU%20iPhone%20OS%2013_3_1%20like%20Mac%20OS%20X)%20AppleWebKit%2F605.1.15%20(KHTML%2C%20like%20Gecko)%20Version%2F13.0.5%20Mobile%2F15E148%20Safari%2F604.1%22%2C%22em%22%3A%22f660ab912ec121d1b1e928a0bb4bc61b15f5ad44d5efdc4e1c92a25e99b8e44a%22%7D%7D%5D&test_event_code=${local_test_event_code}&access_token=${local_access_token}`
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const sendConversionAPI = () => {
    const customer_id = environment.objectContext.id
    console.log(`Sending conversion API for ${customer_id}`)
    makeConversionApi().then((response) => {
      if (true === response.ok) {
        setSentStatus('Conversion API Test Event Sent!')
        setSentCount(sentCount + 1)
      }
    })
  }

  return (
    <ContextView
      title="Sending Conversion API on this customer"
      brandColor="#F6F8FA" // replace this with your brand color
      brandIcon={BrandIcon} // replace this with your brand icon
    >
      <Box>
        <Button type="primary" onPress={() => sendConversionAPI()}>
          Call Conversion API
        </Button>
      </Box>
      <Box>
        <Inline
          css={{
            font: 'body',
            fontWeight: 'semibold',
            color: 'success',
            marginY: 'large',
          }}
        >
          {sentCount > 0 && (
            <>
              {sentStatus} X{sentCount}
            </>
          )}
        </Inline>
      </Box>
    </ContextView>
  )
}

export default App
