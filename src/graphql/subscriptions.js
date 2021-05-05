/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTheme = /* GraphQL */ `
  subscription OnCreateTheme {
    onCreateTheme {
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
export const onUpdateTheme = /* GraphQL */ `
  subscription OnUpdateTheme {
    onUpdateTheme {
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
export const onDeleteTheme = /* GraphQL */ `
  subscription OnDeleteTheme {
    onDeleteTheme {
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
export const onCreateTopic = /* GraphQL */ `
  subscription OnCreateTopic {
    onCreateTopic {
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
export const onUpdateTopic = /* GraphQL */ `
  subscription OnUpdateTopic {
    onUpdateTopic {
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
export const onDeleteTopic = /* GraphQL */ `
  subscription OnDeleteTopic {
    onDeleteTopic {
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
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment {
    onCreateComment {
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
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment {
    onUpdateComment {
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
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment {
    onDeleteComment {
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
