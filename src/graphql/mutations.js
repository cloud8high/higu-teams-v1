/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTheme = /* GraphQL */ `
  mutation CreateTheme(
    $input: CreateThemeInput!
    $condition: ModelThemeConditionInput
  ) {
    createTheme(input: $input, condition: $condition) {
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
export const updateTheme = /* GraphQL */ `
  mutation UpdateTheme(
    $input: UpdateThemeInput!
    $condition: ModelThemeConditionInput
  ) {
    updateTheme(input: $input, condition: $condition) {
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
export const deleteTheme = /* GraphQL */ `
  mutation DeleteTheme(
    $input: DeleteThemeInput!
    $condition: ModelThemeConditionInput
  ) {
    deleteTheme(input: $input, condition: $condition) {
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
export const createTopic = /* GraphQL */ `
  mutation CreateTopic(
    $input: CreateTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    createTopic(input: $input, condition: $condition) {
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
export const updateTopic = /* GraphQL */ `
  mutation UpdateTopic(
    $input: UpdateTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    updateTopic(input: $input, condition: $condition) {
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
export const deleteTopic = /* GraphQL */ `
  mutation DeleteTopic(
    $input: DeleteTopicInput!
    $condition: ModelTopicConditionInput
  ) {
    deleteTopic(input: $input, condition: $condition) {
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
export const createComment = /* GraphQL */ `
  mutation CreateComment(
    $input: CreateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    createComment(input: $input, condition: $condition) {
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
export const updateComment = /* GraphQL */ `
  mutation UpdateComment(
    $input: UpdateCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    updateComment(input: $input, condition: $condition) {
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
export const deleteComment = /* GraphQL */ `
  mutation DeleteComment(
    $input: DeleteCommentInput!
    $condition: ModelCommentConditionInput
  ) {
    deleteComment(input: $input, condition: $condition) {
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
