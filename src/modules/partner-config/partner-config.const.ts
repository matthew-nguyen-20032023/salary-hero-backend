export enum PartnerMessageSuccess {
  UpdateCompanyInfoSuccess = "Update company info successfully.",
  ListWorkerSuccess = "Get list worker successfully.",
  ConfigWorkerSalarySuccess = "Config worker salary successfully.",
  LockWalletSuccess = "Worker wallet locked successfully.",
  UnlockWalletSuccess = "Worker wallet unlocked successfully.",
}

export enum PartnerMessageFailed {
  CompanyInfoRequire = "Please update company info to setup worker salary.",
  InvalidWorker = "Invalid worker, please choose another worker email.",
  InvalidWorkerConfig = "Invalid worker config salary.",
  InvalidWorkerWallet = "Invalid worker wallet.",
}
