/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTheme = /* GraphQL */ `
  query GetTheme($id: ID!) {
    getTheme(id: $id) {
      id
      name
      owner
      topics {
        items {
          id
          themeId
          name
          owner
          likes
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listThemes = /* GraphQL */ `
  query ListThemes(
    $filter: ModelThemeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listThemes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        owner
        topics {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTopic = /* GraphQL */ `
  query GetTopic($id: ID!) {
    getTopic(id: $id) {
      id
      themeId
      name
      owner
      likes
      comments {
        items {
          id
          topicId
          name
          owner
          likes
          createdAt
          updatedAt
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listTopics = /* GraphQL */ `
  query ListTopics(
    $filter: ModelTopicFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTopics(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        themeId
        name
        owner
        likes
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      topicId
      name
      owner
      likes
      createdAt
      updatedAt
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        topicId
        name
        owner
        likes
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listTopicsByThemeId = /* GraphQL */ `
  query ListTopicsByThemeId(
    $themeId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelTopicFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTopicsByThemeId(
      themeId: $themeId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        themeId
        name
        owner
        likes
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listCommentsByTopicId = /* GraphQL */ `
  query ListCommentsByTopicId(
    $topicId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCommentsByTopicId(
      topicId: $topicId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        topicId
        name
        owner
        likes
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
