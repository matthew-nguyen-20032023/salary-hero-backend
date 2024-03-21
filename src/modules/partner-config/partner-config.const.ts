export enum PartnerMessageSuccess {
  UpdateCompanyInfoSuccess = "Update company info successfully",
  ListWorkerSuccess = "Get list worker successfully",
  ConfigWorkerSalarySuccess = "Config worker salary successfully",
}

export enum PartnerMessageFailed {
  CompanyInfoRequire = "Please update company info to setup worker salary",
  InvalidWorker = "Invalid worker, please choose another worker email",
}
