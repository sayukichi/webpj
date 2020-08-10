/*** スケジュール登録 notice ***
  予定はsetSchedules()に書く．
  newSchedule( 年，月, 日，"td セルオプション", "予定" );
  ・日
    －calDate( 年, 月, 週, 曜日0(sun)..6(sat))を使えば，
      第n×曜日 形式の指定も可能です．
  ・td セルオプション <td ここ>
    －指定なしは""で．
    －悪いがフォントカラーはスタイルシート("style='color:white'")で指定してくれ．
    －同じ日に複数登録したりすると効かない事があるから注意．
  ・"予定"
    －HTMLタグ使えます．
  ・祝日とあわせてMAXEVENT件までスケジュールを設定可能
*** notice スケジュール登録 ***/
function setSchedules(){
  
  //サンプル予定
  newSchedule( 2011, 1, 1, "class = 'holiday'", "新年おめでとう♪<br>" );
  







  
}