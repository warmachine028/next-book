import { useState } from 'react'
import { useUploadThing, useToast } from '@/hooks'

export interface Attachment {
	file: File
	mediaId?: string
	isUploading: boolean
}

const useMediaUpload = () => {
	const { toast } = useToast()

	const [attachments, setAttachments] = useState<Attachment[]>([])
	const [uploadProgress, setUploadProgress] = useState<number>()

	const { startUpload, isUploading } = useUploadThing('attachment', {
		onBeforeUploadBegin(files) {
			const renamedFiles = files.map((file) => {
				const extension = file.name.split('.').pop()
				return new File([file], `attachment_${crypto.randomUUID()}.${extension}`, {
					type: file.type
				})
			})
			setAttachments((prev) => [...prev, ...renamedFiles.map((file) => ({ file, isUploading: true }))])
			return renamedFiles
		},
		onUploadProgress: setUploadProgress,
		onClientUploadComplete(res) {
			setAttachments((prev) =>
				prev.map((a) => {
					const uploadResult = res.find((r) => r.name === a.file.name)

					if (!uploadResult) {
						return a
					}
					return {
						...a,
						mediaId: uploadResult.serverData.mediaId,
						isUploading: false
					}
				})
			)
		},
		onUploadError(e) {
			setAttachments((prev) => prev.filter((a) => !a.isUploading))
			toast({
				variant: 'destructive',
				description: e.message
			})
		}
	})

	const handleStartUpload = (files: File[]) => {
		if (isUploading) {
			return toast({
				variant: 'destructive',
				description: 'Please wait for the current upload to finish.'
			})
		}

		if (attachments.length + files.length > 5) {
			return toast({
				variant: 'destructive',
				description: 'You can only upload up to 5 attachments per post.'
			})
		}
		startUpload(files)
	}

	const removeAttachment = (fileName: string) =>
		setAttachments((prev) => prev.filter((a) => a.file.name !== fileName))

	const reset = () => {
		setAttachments([])
		setUploadProgress(undefined)
	}

	return {
		startUpload: handleStartUpload,
		attachments,
		isUploading,
		uploadProgress,
		removeAttachment,
		reset
	}
}
export default useMediaUpload
