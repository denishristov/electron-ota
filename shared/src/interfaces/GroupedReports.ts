
export interface IGroupedReportModel {
	timestamp: string
	count: number
}

export interface IGroupedReportsModel {
	[reportType: string]: IGroupedReportModel[]
}
