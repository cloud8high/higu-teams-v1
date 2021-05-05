# ひぐチームす.ver1 （コミュニケーションツール）

## アプリ概要
- Slack や Teams のような**コミュニケーションツール**を作りました。  
- 掲示板のように、「テーマ」配下で「トピック」を作成し、「コメント」を追加していくことができます。
- GraphQL のサブスクリプションを利用しているため、他のユーザーが作成・編集・削除したアイテムが、自分の画面にもリアルタイムで同期されます。
- 詳細は以下の動画をご覧ください。
  - [![YouTube - AWS Amplify と Vue.js で Teams みたいなコミュニケーションツールを作ってみた。](https://user-images.githubusercontent.com/40209684/117141927-1919b600-adea-11eb-91f0-1fcd302a3fc0.jpg)](https://youtu.be/fB4-qATHmY8)

## 技術的特徴
- フロントエンドは Vue.js と Vuetify を使用。
- バックエンドは AWS Amplify の Auth（認証認可）や API（DB）を使用。 CI/CD パイプラインも実装。

## 開発方法
### 本リポジトリをクローンし、自身の AWS アカウントでデプロイする場合...
```
## Vue-CLI と Amplify-CLI のグローバルへのインストールと設定
$ npm install -g @vue/cli
$ npm install -g @aws-amplify/cli
$ amplify configure
　## amplify検証用ユーザー（プロファイル）のクレデンシャル情報を入力

## プロジェクトのコピーと初期設定
$ git clone {リポジトリURL}
$ cd higu-teams-v1/
$ npm install
　## npm ci でも可
$ amplify init
? Enter a name for the environment dev
? Choose your default editor: Vim (via Terminal, Mac OS only)
Using default provider  awscloudformation
? Select the authentication method you want to use: AWS profile
? Please choose the profile you want to use {Amplify profile 名}

## クラウドへの反映（各種リソースの作成）
$ amplify push
? Are you sure you want to continue? Yes
? Do you want to update code for your updated GraphQL API Yes
? Do you want to generate GraphQL statements (queries, mutations and subscription) based on your schema types?
This will overwrite your current graphql queries, mutations and subscriptions Yes

## ローカルでの動作確認
$ amplify serve
```

## リソース削除方法
以下の手順でリソースを削除できる。

1. `amplify delete` コマンドを実行 （基本はこれで全部削除される） [参考](http://educationhub-31789470-a146-11ea-85be-f18c4f5a36d8.s3-website-us-east-1.amazonaws.com/9_cleanup.html)
2. CloudFormation のルートスタックを選択して削除
3. Amplify Console （コンソール画面）からプロジェクトを選択して削除
4. それでも消えない Amplify プロジェクトは、AWS CLI を用いて、`aws amplify delete-app` コマンド で消せる [参考](https://awscli.amazonaws.com/v2/documentation/api/latest/reference/amplify/delete-app.html)
5. Cognito, DynamoDB, S3 などが消えていることを確認。残っていたら手動で削除
6. CodeCommit, Cloud9 環境, IAMユーザー, IAMロールは手動で削除（任意）

## ライセンス
- [MIT](https://github.com/cloud8high/linebot-translation-chalice/blob/main/LICENSE)

## 作成者について
- [Qiita](https://qiita.com/hayate_h)
- [Twitter](https://twitter.com/cloud8high)
- [GitHub](https://github.com/cloud8high)

## 参考資料等
- [Amplify で開発してみる シリーズ](https://www.northdetail.co.jp/blog/905/)
  - Amplify, AppSync, Vue, Vuetify についての理解を深められる。
  - 作成者も、上記記事を写経しながら Vue と Amplify についての理解を深めた。
- [AMPLIFY SNS WORKSHOP](https://amplify-sns.workshop.aws/ja/)
  - Amplify, AppSync についてとても詳しい（フロントエンドは React を利用）
  - 特に AppSync のディレクティブの使い方が参考になる。Amplify Mock についても理解が深まる。

## 個人備忘録
### 公開時に注意するファイル
`amplify/team-provider-info.json` はプロジェクト固有の情報を含むため、一般公開時には必ず削除。

### 個人開発リポジトリとの関係性
プライベートリポジトリ `x-higu-teams-1` にて、個人開発を継続中。  
2021年5月5日 23時時点の、当該リポジトリ main ブランチの内容を、このリポジトリで公開。 