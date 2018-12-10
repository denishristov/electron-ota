import React from 'react'
import { observer, inject } from 'mobx-react'

interface IApplicationsProps {
	applicationsStore: any
}

const Applications = ({ applicationsStore }: IApplicationsProps) => {
	setTimeout(applicationsStore.fetch, 500)
	return (
		<div>

		</div>
	)
}

export default inject(({ applicationsStore }) => ({ applicationsStore }))(observer(Applications))