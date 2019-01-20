import React from 'react'
import ReactDropzone, { DropFilesEventHandler } from 'react-dropzone'
import { list } from '../../util/functions'

interface IProps  {
	onDrop?: DropFilesEventHandler
	name?: string
	children?: React.ReactNode
	accept?: string
	messages?: {
		active: string,
		notActive: string,
	}
}

export default function Dropzone({ messages, children, ...props }: IProps) {
	return (
		<ReactDropzone multiple={false} {...props}>
			{({ getRootProps, getInputProps, isDragActive }) => {
				return (
					<div
						{...getRootProps()}
						className={list('dropzone', isDragActive && 'dropzone-active')}
					>
						<input {...getInputProps()} />
						{children || (messages && (isDragActive
							? messages.active
							: messages.notActive
						))}
					</div>
				)
			}}
		</ReactDropzone>
	)
}
