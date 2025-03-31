import MYRequest from "../../request/index";

// 获取热搜数据
export function fetchhotMessages() {
  return MYRequest.get({ url: "/topic/hotMessages" });
}

// 根据用户输入生成话题
export function fetchTopicJson(data) {
  return MYRequest.post({ url: "/topic/generateTopic", data: data });
}

// 用户收藏某个话题
// body的参数
// { topicId:string, title:string, content_template:string, style:string, type:string }的对象
export function collectTopic(userId, data) {
  return MYRequest.post({
    url: `/topic/${userId}/collect`,
    data,
  });
}

// 用户取消收藏某个话题
// 参数 userId, topicId
export function cancelCollectTopic(userId, topicId) {
  return MYRequest.delete(`/topic/${userId}/collect/${topicId}`);
}

// 获取用户收藏的话题列表
// 参数 userId
export function fetchTopicList(userId) {
  return MYRequest.get({
    url: `/topic/${userId}/collect`,
  });
}
