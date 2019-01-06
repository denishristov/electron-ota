import React from 'react'

interface IProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement> {
	src: string
}

export default function SVG({ src, ...props }: IProps) {
	return (
		<span dangerouslySetInnerHTML={{ __html: src }} {...props} />
	)
}
