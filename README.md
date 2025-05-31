# Slack Webhook Demo

This is a project created using **React.js**, **Vite**, **Typescript**, and **Slack Webhooks**. This project is used to send error messages on Slack whenever API returns an error. The project is currently setup to handle the following HTTP Status Codes:

- 400 (Bad Request)
- 403 (Forbidden)
- 404 (Not Found)
- 422 (Unprocessable Content)
- 429 (Too Many Requests)
- 500 (Internal Server Error)
- 503 (Service Unavailable)

The backend code is deployed on **Vercel** and is available on **Github**:

- **Github Repo** - [slack-webhook-demo](https://github.com/lakshaykapoor08/slack-webhook-demo)
- **Backend URL** - https://slack-webhook-demo-orpin.vercel.app

## Steps to Setup Slack Webhook for Selected Channel

Follow these steps to create a Slack webhook using "Incoming Webhooks" and integrate it with your application:

### 1. Create a Slack App

1. Go to [Slack API Apps](https://api.slack.com/apps)
2. Click **"Create New App"**
3. Choose **"From scratch"**
4. Enter your app name (e.g., "Error Notification Bot")
5. Select your workspace
6. Click **"Create App"**

### 2. Enable Incoming Webhooks

1. In your app dashboard, navigate to **"Features"** → **"Incoming Webhooks"**
2. Toggle **"Activate Incoming Webhooks"** to **ON**
3. Click **"Add New Webhook to Workspace"**

### 3. Configure Channel and Permissions

1. Select the channel where you want to receive error notifications (e.g., `#errors-stg`)
2. Click **"Allow"** to grant permissions
3. Your webhook URL will be generated automatically

### 4. Copy Webhook URL

1. Copy the webhook URL that looks like:
   ```
   https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
   ```
2. Keep this URL secure as it provides access to post messages to your channel

### 5. Configure the Application

1. Open the Slack Webhook Demo application
2. In the **"Slack Configuration"** section:
   - **Channel Name**: Enter your channel name (e.g., `#errors-stg`)
   - **Webhook URL**: Paste the webhook URL from step 4
3. Click **"Save Configuration"**
4. You should see a green checkmark indicating "Slack configuration is active"

### 6. Test the Integration

1. Click any of the error buttons (400, 403, 404, etc.) in the application
2. Check your Slack channel for the error notification message
3. The message will include:

   - Error status code and type
   - API endpoint that was called
   - Request method (GET, POST, PUT, etc.)
   - Timestamp
   - Full request curl command
   - Response data

   ![Slack Notification](public/image.png)
   _Example error notification received in Slack channel_

### 7. Webhook Message Format

The webhook sends rich formatted messages with the following information:

```
🔵 *Page Name*
🟣 *Error Code - Slack Webhook Demo*
🟡 *API CALL*: `/api/v1/error/400`
🔴 *PANEL PAGE URL*: `/`
⚫ *METHOD*: `POST`
🟤 *TIMESTAMP*: `2025-01-31T10:30:00.000Z`
```

_Request Curl:_

```
curl -X POST 'https://slack-webhook-demo-orpin.vercel.app/api/v1/error/400' \
 -H 'Content-Type: application/json' \
 -d '{"user_name":"Himanshu Kumar","email":"himanshu064@gmail.com"}'
```

_Response:_

```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Bad request: Invalid input data!",
  "data": []
}
```

## 8. Security Best Practices

- **Keep webhook URLs private**: Never commit webhook URLs to public repositories
- **Use environment variables**: Store webhook URLs in environment variables for production
- **Rotate webhooks regularly**: Generate new webhook URLs periodically for security
- **Monitor usage**: Check Slack app metrics to monitor webhook usage

## 9. Troubleshooting

**Webhook not working?**

- Verify the webhook URL is correct and active
- Check that the channel name includes the `#` symbol
- Ensure your Slack app has permissions to post to the channel
- Check browser console for any error messages

**Messages not appearing in Slack?**

- Verify you're looking in the correct channel
- Check if the bot was added to a private channel
- Ensure the webhook URL hasn't expired

## Project Structure

```
slack-webhook-demo/
├── src/
│   ├── components/
│   │   └── RenderAPIs.tsx       # Main component with Slack configuration
│   ├── core/
│   │   └── infrastructure/
│   │       └── http.ts          # Axios interceptor with webhook logic
│   └── ...
├── api/                         # Backend API routes (deployed on Vercel)
│   └── index.js
├── package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
