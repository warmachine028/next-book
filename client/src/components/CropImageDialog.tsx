'use client'
import { useRef } from 'react'
import { Cropper, ReactCropperElement } from 'react-cropper'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import 'cropperjs/dist/cropper.css'

interface CropImageDialogProps {
	src: string
	cropAspectRatio: number
	onCropped: (blob: Blob | null) => void
	onClose: () => void
}

const CropImageDialog = ({ src, cropAspectRatio, onCropped, onClose }: CropImageDialogProps) => {
	const cropperRef = useRef<ReactCropperElement>(null)

	const crop = () => {
		const cropper = cropperRef.current?.cropper
		if (!cropper) {
			return
		}
		cropper.getCroppedCanvas().toBlob((blob) => onCropped(blob), 'image/webp')
		onClose()
	}
	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Crop image</DialogTitle>
					<DialogDescription>Crop your image to the desired aspect ratio.</DialogDescription>
				</DialogHeader>
				<Cropper
					src={src}
					aspectRatio={cropAspectRatio}
					guides={false}
					zoomable={false}
					ref={cropperRef}
					className="mx-auto size-fit"
				/>
				<DialogFooter>
					<Button variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={crop}>Crop</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

CropImageDialog.displayName = 'CropImageDialog'

export default CropImageDialog
