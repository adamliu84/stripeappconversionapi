import { Box, ContextView, Inline } from '@stripe/ui-extension-sdk/ui'
import type { ExtensionContextValue } from '@stripe/ui-extension-sdk/context'
import { List, ListItem, Button } from '@stripe/ui-extension-sdk/ui'
import {
  createHttpClient,
  STRIPE_API_KEY,
} from '@stripe/ui-extension-sdk/http_client'
import Stripe from 'stripe'
const stripe: Stripe = new Stripe(STRIPE_API_KEY, {
  httpClient: createHttpClient() as Stripe.HttpClient,
  apiVersion: '2020-08-27',
})
import { useEffect, useState } from 'react'

const PaymentDetailView = ({
  userContext,
  environment,
}: ExtensionContextValue) => {
  const [metadata, setMetadata] = useState(null)

  useEffect(() => {
    stripe.paymentIntents
      .retrieve(environment.objectContext.id)
      .then((response) => setMetadata(response.metadata))
  }, [])

  const addTimestampMetadata = () => {
    const timestamp = Math.round(new Date().getTime() / 1000)
    var tempobj: any = {}
    tempobj['key_' + timestamp] = 'value_' + timestamp
    stripe.paymentIntents
      .update(environment.objectContext.id, {
        metadata: tempobj,
      })
      .then((response) => setMetadata(response.metadata))
  }

  return (
    <ContextView title="Payment Intent Metadata List">
      <Box>
        <Button
          type="primary"
          css={{
            marginTop: 'small',
            padding: 'small',
          }}
          onClick={(e) => addTimestampMetadata()}
        >
          Add TS Metadata
        </Button>
        <List
          onAction={(id: string | number) => console.log(`Pressed row #${id}`)}
          aria-label="Example of a List"
        >
          <MetadataListItem metadata={metadata} />
        </List>
      </Box>
    </ContextView>
  )
}

const MetadataListItem = (props) => {
  const { metadata } = props
  let metadataListItem: any = <></>
  if (null !== metadata) {
    metadataListItem = Object.keys(metadata).map((key) => (
      <ListItem value={metadata[key]} id={key} title={<Box>{key}</Box>} />
    ))
  } else {
  }
  return metadataListItem
}

export default PaymentDetailView
