import dayjs from "dayjs";
export function formatDateTime(isoString) {
  try {
    return dayjs(isoString).format("YYYY年M月D日 HH:mm:ss");
  } catch (error) {
    console.error("日期格式化失败:", error);
    return "";
  }
}
