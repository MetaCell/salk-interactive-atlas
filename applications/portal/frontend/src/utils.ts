import { AxiosResponse } from "axios";
import { DownloadPopulations } from "./apiclient/workspaces";
import {
  POPULATION_UNKNOWN_CHILD
} from "./utilities/constants"


export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { hour: '2-digit', minute: '2-digit' });
}

export function getBaseDomain() {
  if (process?.env?.DOMAIN) { // Dev
    return process.env.DOMAIN
  }
  return window.location.host.includes('www.') ? window.location.host.split('.').slice(1).join('.') : window.location.host  // remove the first part of the hostname
}

export function getDateFromDateTime(date: string) {
  return date ? date?.split(' ')[0] : date;
}

export function downloadFile(response: AxiosResponse<DownloadPopulations>) {
  // @ts-ignore
  const blob = new Blob([response.data], { type: response.headers['content-type'] });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement('a');


  // Get the filename from the content-disposition header
  const contentDisposition = response.headers['content-disposition'];
  let filename = "compressed_populations.zip";
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/i);
    if (match && match.length > 1) {
      filename = match[1];
    }
  }
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function hasNoAtSign(inputString: string) {
  return (inputString.match(/@/g) || []).length === 0;
}

export function isNameUnknown(inputString: string) {
  return inputString.toLowerCase() === POPULATION_UNKNOWN_CHILD;
}

export const pdfNameOnFile = (pdfName: string) => {
  if (!pdfName) {
    return ''
  }
  return pdfName.split('.')[0]
}

export const formatDateTime = (date: string) => {
  const dateObj = new Date(date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear()
  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()
  const ampm = hours >= 12 ? 'pm' : 'am';
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = formattedHours + ':' + formattedMinutes + ' ' + ampm;
  return `${day} ${month} ${year}, ${strTime}`
}