import { StreamChat } from 'stream-chat'

const streamServerClient = StreamChat.getInstance(
	process.env.NEXT_PUBLIC_STREAM_KEY as string,
	process.env.STREAM_SECRET as string
)

export default streamServerClient
