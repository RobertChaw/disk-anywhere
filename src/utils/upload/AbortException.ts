export function AbortException() {
  this.message = "request was cancelled";
  this.name = "UserException";
}
