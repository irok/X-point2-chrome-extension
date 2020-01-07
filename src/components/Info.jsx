import React from 'react';

const Info = ({msg}) => <p className="info">{msg}</p>;

export default {
  NoSettings: () => (
    <Info msg="アイコンを右クリックし、オプションからログイン情報を設定してください。"/>
  ),
  LoginFailed: () => (
    <Info msg="ログインできませんでした。"/>
  ),
  NetworkError: () => (
    <Info msg="ネットワークエラーが発生しました。社外の場合はVPNを確認してください。"/>
  )
};
