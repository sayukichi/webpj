
/*  /_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

    +++ Calendar 2 +++
    ver 1.1
    LastModified : 2005-09/22
    
    Powered by kerry
    http://202.248.69.143/~goma/
    
    動作ブラウザ :: あまりにも古いブラウザでなければ動作
    
    
    過去未来のカレンダをリロード無しで再描画できるブラウザは
    IE4+, Gecko, Opera7+
    
    /_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
    
    * Usage
    
    @ 適当な場所で外部ファイルを読み込みカレンダを描画させたい場所へ以下を記述
    
    <script type="text/javascript" src="calendar2.js"> < /script>
    
    <script type="text/javascript"><!--
    calendar_print(); // -->
    < /script>
    
    
    
    @ 任意の年月のカレンダを描画させる ------------------------------
    
    <script type="text/javascript"><!--
    _year           = 2005;     // 年
    _month          = 10;       // 月
    clndrVar.fixed  = true;     // 複数作る場合は必ず 真 を代入しておく。
                                // 過去未来の表示書き換え機能が対応していない為。
    
    // 複数作る場合は親要素の ID が重複するのを避けるため
    //  clndrAttrs.boxID を連番にするなど細工する。例えば
    //  for (i=1; i<=12; i++) { 
    //      clndrAttrs.boxID += i;
    //      calendar_print( _year , i );
    //  }
    
    calendar_print( _year , _month );
    
    
    
    // ↓でも可能。calendar_print(); は親要素を作るのに対し
    // calendar_make(); は Table の親要素を作らない
    
    isCalendar = calendar_make( _year , _month );
    document.write( isCalendar );
    
    // -->
    < /script>



    @ 動的な時刻 ------------------------------------------------------

    calendar_setDynamicTime( id , format );

    id      -> 対象要素の ID 属性の値
    format  -> 時間のフォーマット
            // フォーマット内で使えるテンプレート
              %Y  -> 年 / 4桁の数字
              %y  -> 年 / 00-99 下2桁の数字
              %M  -> 月 / 1-12 の数字
              %E  -> 月 / January - December という文字列
              %e  -> 月 / Jan - Dec という3文字の文字列
              %D  -> 日 / 00-31 の数字
              %H  -> 時 / 00-23 の数字
              %h  -> 時 / 00-11 の数字
              %m  -> 分 / 00-59 の数字
              %S  -> 秒 / 00-59 の数字
              %A  -> AM か PM という文字列
              %a  -> am か pm という文字列
              %J  -> 曜日 / 日 - 土 という文字列
              %W  -> 曜日 / Sunday - Saturday という文字列
              %w  -> 曜日 / Sun - Sat という3文字の文字列

    時刻を表示したい要素へ一意なID を付けたら
    e.g.
    <p id="istime">< /p>
    <script>
    calendar_setDynamicTime("istime", "'%y %M/%D (%J) %H:%m:%S");
    < /script>





    @ カウント・アップ / ダウン ---------------------------------------

    calendar_setDynamicCount( id, format_1, format_2, format_3, 
                              year[, month[, date[, hour[, min[, sec]]]]]);
    又は
    calendar_setDynamicCount( id, formats, dates );

    id      ->  挿入対象要素のID 属性の値
    format_1->  指定日時がくるまで表示するフォーマット
    format_2->  指定日時になったら表示するフォーマット
    format_3->  指定日時が過ぎたら表示するフォーマット
    formats ->  上記３つを配列、連想配列で渡せる。
                // 配列
                formats = new Array(format_1, format_2, format_3); 
                // 連想配列。キーは固定
                formats = { 
                          befor   : format_1,
                          just    : format_2,
                          after   : format_3
                          };
                // フォーマット内で使えるテンプレート
                %D  -> 指定日までの日数
                %H  -> 指定日までのトータル "時間"
                %h  -> 指定日までの時間 0-23
                %M  -> 指定日までのトータル "分"
                %m  -> 指定日までの分 0-59
                %S  -> 指定日までのトータル "秒"
                %s  -> 指定日までの秒 0-59
                e.g.
                format_1 = "%D日＋%2h:%0m:%0s は %S 秒と等価。";

                %の直後に "0" (zero) を付けると1桁の場合は 0 で桁あわせ。
                %の直後に "2" (two) を付けると1桁の場合はスペースで桁あわせ。
                %の直後に "1" (one) を付けると数字そのまま。省略時、無指定と同じ。

    year    -> 指定 "年"。省略不可
    month   -> 指定 "月"。省略すると "1月" を指定したことになる
    date    -> 指定 "日"。省略すると "1日" を指定したことになる
    hour    -> 指定 "時"。省略すると "0時" を指定したことになる
    min     -> 指定 "分"。省略すると "0分" を指定したことになる
    sec     -> 指定 "秒"。省略すると "0秒" を指定したことになる
    dates   -> 上記を配列で渡す
              dates = new Array(year, month, date, hour, min, sec);
              dates = { // 連想配列で渡す
                      year    : 2005,
                      month   : 12,
                      date    : 24,
                      hour    : 0,
                      min     : 0,
                      sec     : 0
                      };

    e.g.
    <p id="birthday_msg">< /p>
    <script>
    formats =   {
              befor   : "私の誕生日まであと %D 日と %h:%0m:%0sです。",
              // "just" は 2006-6/14 になった瞬間から日付が変わるまで表示される。
              // もし 2006,6 としたら 月が変わるまで、
              // 2006,6,14,3 と時間まであったらこの 1時間の間、
              // 2006,6,14,3,20,48 と秒まで指定したら 1秒間。という具合 ;)
              just    : "今日は私の誕生日です。",
              after   : "私は %H 時間前に一つ歳をとりました。"
              };
    calendar_setDynamicCount( "birthday_msg", formats, 2006, 6, 14 );
    < /script>

    
    /_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/




    
    ************ 設定 ******************* */



function calendar_init()    
{

//  /_/_/_/_/_/_/_/ 基本設定 /_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/
    
    /*  
     *  曜日を [日月火....] 漢字一文字または [Sun,Mon,Tue....] 三文字の英表記を
     *  "ja" 又は "en" で指定
     */
    clndrVar.weekLang       = "ja";
    
    /*
     *  CAPTION の現在カレンダに表示されている年と月のフォーマット。
     *  
     *  %Y -> 年 ( 4桁の数字 )
     *  %y -> 年 ( 00-99 までの数字 )
     *  %M -> 月 (  1-12 までの数字 )
     *  %m -> 月 ( 01-12 までの数字 )
     *  %E -> 月 ( 英表記 January, February, March ...)     
     *  %e -> 月 ( 省略された3文字の英 Jan, Feb, Mar ...)
     *　%L -> 前の月を表示する際のリンク文字
     *　%N -> 次の月を表示する際のリンク文字
     */
    clndrVar.captionFormat  = "%L %Y年 %M月 %N";

    /*  
     *  %L に入る前の月を表示する際のリンク文字。画像を使うならタグを記述
     */
    clndrVar.lastMonthChar  = "&#8810;";
    
    /*  
     *  %N に入る次の月を表示する際のリンク文字。画像を使うならタグを記述
     */
    clndrVar.nextMonthChar  = "&#8811;";
    
    /*
     *  空の (日付の無い) セルに入れる文字
     */
    clndrVar.daySpaceChar   = "*";
    
    /*
     *  過去未来のカレンダ描画機能を使用しない
     */
    clndrVar.fixed          = false; // はい -> true | いいえ -> false
    
    /*
     *  ( 上の clndrVar.fixed が true の時にはこの設定は意味がない )
     *  false (偽) にすると古いブラウザで過去未来のカレンダを生成する際に
     *  ページをリロードし再描画を行なわなくなる。
     *  つまり旧ブラウザでは今月のカレンダのみとなり、過去未来のカレンダを生成
     *  する為のリロードを行なわず、リンク文字も表示されない。
     */
    clndrVar.oldBrwsReload  = true; // リロード有効 -> true | 無効 -> false
    
    /*
     *  旧ブラウザで過去未来のカレンダを生成する際、自分自身 (のページ) に
     *  クエリを渡し描画すべき年月を判定している。その際のキー。
     */
    clndrVar.queryName      = "calendar";
    
    /*
     *  旧ブラウザ用リロード時ジャンプ先カレンダの A Name の値の suffix
     */
    clndrVar.aName          = "X_calendar";
    
    
//  /_/_/_/_/_/_/_/ 属性等の設定 /_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

    /*
     *  カレンダの TABLE 要素の親要素
     *  この要素の中にカレンダが描画される
     */
    clndrVar.boxElm     = "div";
    
    /*
     *  上記要素の ID
     *  ID が重複しているなら変更する。普通は無視してかまわない。
     */
    clndrAttrs.boxID    = "X_calendar_boxId" ;
    
    /*  
     *  TABLE 要素の属性
     *  <TABLE "ココ">
     */
    clndrAttrs.table    = "class='X_calendar_table' summary='カレンダ'" ;
    
    /*
     *  CAPTION 要素の属性。
     *  <TABLE> <CAPTION "ココ"> %L %Y年 %M月 %N < /CAPTION>
     */
    clndrAttrs.caption  = "class='X_calendar_caption'" ;
    
    /*
     *  曜日の TH 要素の属性
     *  <TABLE> <CAPTION> <THEAD> <TR> <TH "ココ">日 <TH "ココ">月....
     */
    clndrAttrs.week     = "class='X_calendar_weeks'" ;
    
    /*
     *  曜日の TH 要素の中の FONT 要素の属性
     *  <TABLE> <CAPTION> <THEAD> <TR> <TH> <FONT "ココ"> 日 <TH> <FONT "ココ"> 月....
     */
    clndrAttrs.weekF    = "" ;
    
    /*
     *  「平日」の日付 TD 要素の属性
     *  <TABLE> <CAPTION> <THEAD> <TR> <TH> 日 <TH> 月....
     *  <TBODY> <TR> <TD "ココ"> 10 <TD "ココ"> 11 ....
     */
    clndrAttrs.def      = "class='X_calendar_default'" ;
    
    /*
     *  「平日」の日付 TD 要素の中の FONT 要素の属性
     *  <TABLE> <CAPTION> <THEAD> <TR> <TH> 日 <TH> 月....
     *  <TBODY> <TR> <TD> <FONT "ココ"> 24 <TD> <FONT "ココ"> 25 ....
     */
    clndrAttrs.defF     = "" ;
    
    /*
     *  「本日」の日付 TD 要素の属性
     *  <TBODY> <TR> <TD "ココ"> 10 <TD> 11 ....
     */
    clndrAttrs.today    = "class='X_calendar_today'" ;
    
    /*
     *  「本日」の日付 TD 要素の中の FONT 要素の属性
     *  <TBODY> <TR> <TD> <FONT "ココ"> 24 <TD> 25 ....
     */
    clndrAttrs.todayF   = "" ;
    
    /*
     *  「日曜祭日」の日付 TD 要素の属性
     *  <TBODY> <TR> <TD "ココ"> 10 <TD> 11 ....
     */
    clndrAttrs.holiday  = "class='X_calendar_holiday'" ;
    
    /*
     *  「日曜祭日」の日付 TD 要素の中の FONT 要素の属性
     *  <TBODY> <TR> <TD> <FONT "ココ"> 24 <TD> 25 ....
     */
    clndrAttrs.holidayF = "" ;
        
    /*
     *  「日曜祭日」の日付 TD 要素の属性
     *  <TBODY> <TR> <TD "ココ"> 10 <TD> 11 ....
     */
    clndrAttrs.saturday  = "class='X_calendar_saturday'" ;
    
    /*
     *  「日曜祭日」の日付 TD 要素の中の FONT 要素の属性
     *  <TBODY> <TR> <TD> <FONT "ココ"> 24 <TD> 25 ....
     */
    clndrAttrs.saturdayF = "" ;
        
    /*
     *  日付のないセル TD 要素の属性
     *  <TBODY> <TR> <TD "ココ"> * <TD "ココ"> * ....
     */
    clndrAttrs.none     = "class='X_calendar_none'";
    
    /*
     *  日付のないセル TD 要素の中の FONT 要素の属性
     *  <TBODY> <TR> <TD> <FONT "ココ"> * <TD> <FONT "ココ"> * ....
     */
    clndrAttrs.noneF    = "" ;
    
    /*
     *  曜日の入っている THEAD 要素の属性
     *  <TABLE> <CAPTION> <THEAD "ココ"> <TR> <TH> 日 <TH> 月 ......
     */
    clndrAttrs.thead    = "" ;
    
    /*
     *  日付の入っている TBODY 要素の属性
     *  <TABLE> <CAPTION> <THEAD> <TR> <TH> 日 <TH> 月 ......
     *  <TBODY "ココ"> <TR> <TD> * <TD> 1 ....
     */
    clndrAttrs.tbody    = "";



//  /_/_/_/_/_/_/_/ リンクの設定 /_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/

    /* 
     *  特定の年月日にリンクをはりたい場合、アンカーの属性を値とし
     *  添え字を年月日とすることで可能。必要なだけ書き連ねませう。
     *  e.g.
     *  clndrLink["#20050101"] = "href='http://127.0.0.1/newyear.html' target='win_foo'";
     *  clndrLink["#20051225"] = "href='xmas.html' title='Merry Merry Christmas!'";
     *
     *  clndrLink   ->  この変数名は固定
     *  "#20050101" ->  4桁の年、2桁の月、2桁の日。一文字目の "#" は以下で変更可能。
     *                  変更する場合は必ず数字ではない文字で一文字以上。例えば "X" なら
     *                  clndrVar.linkDaySuffix  = "X";
     *                  clndrLink["X20050822"]  = "hello.html"; // またはJS の命名規則に沿っていれば
     *                  clndrLink.X20050822     = "hello.html"; // ← これも可。同じこと
     *  = "値";         -> このリンク、 A 要素の属性
     */
    clndrVar.linkDaySuffix  = "#";


    /*
     *  もし今日から何日後、又は何日前という日付がほしい時は以下の関数を利用できる。
     *
     *  getDayF( N ); 
     *
     *  N は明日なら 1、3日前なら -3 という数値。0 (zero) や省略すると本日。
     *  この関数を呼び出すと常に今日を基準とした前後 N 日がフォーマット済みで返ってくる。
     *  フォーマットは変数の添え字に使える文字列で "#20051225" というもの。
     *  e.g., 
     *  clndrLink[ getDayF(  ) ] = "href='today.html'";     // 常に今日の日付
     *  clndrLink[ getDayF( 1) ] = "href='tomorrow.html'";  // 常に一日後の日付
     *  clndrLink[ getDayF(-1) ] = "href='yesterday.html'"; // 常に一日前の日付
     */
    



//  /_/_/_/_/_/_/_/ 設定終わり /_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/_/


    


    clndrVar.pDelimiter     = ".";
    clndrVar.weekLang       = clndrVar.weekLang.toLowerCase();
}





clndrLink   = new Array();
clndrAttrs  = new Array();
clndrVar    = new Array();

clndrVar.weeks      = new Array();
clndrVar.weeks.ja   = new Array("日", "月", "火", "水", "木", "金", "土");
clndrVar.weeks.en   = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");
clndrVar.weeks.en_f = new Array("Sunday", "Monday", "Tuesday", "Wednesday", 
                                "Thursday", "Friday", "Saturday");
clndrVar.month      = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
clndrVar.month_f    = new Array("January", "February", "March", "April", "May", "June", 
                                "July", "August", "September","October", "November", "December");


function getDayF(_n) 
{
    var dd = new Date();
    if (!isNaN(_n)) {
        _n *= 60* 60* 24* 1000;
        dd.setTime(dd.getTime() + _n);
    }
    var y = dd.getYear();   if (y<1900) y += 1900;
    var m = dd.getMonth();  if (++m < 10) m = "0"+ m;
    var d = dd.getDate();   if (d < 10) d = "0"+ d;
    return clndrVar.linkDaySuffix+ y+ m+ d;
}

function calendar_getVAEday(_y, _m) {
    return Math.floor((_m== 3? 20.8431: 23.2488)+ (0.242194* (_y- 1980))- Math.floor((_y- 1980) / 4))+"";
}

function calendar_getLastDate(_y, _m) {
    return _m == 2? ((!(_y%4) && _y%100) || !(_y%400))? 29: 28:
                       (_m==4 || _m==6 || _m==9 || _m==11)? 30: 31;
}

function calendar_getHoliday(_y, _m, _fd)
{
    var hdz = new Array();
    if (_y < 1948) return hdz;
    if (!(_fd > 1)) _fd += 7;

    switch (_m)
    {
        case  1: hdz = new Array(1, 9+(7-_fd));         break;  // 成人の日(第２月曜日)
        case  2: if (_y ==1989) hdz= new Array(11, 24);
                 else           hdz[0] = 11;            break;  // 建国記念日
        case  3: hdz[0] = calendar_getVAEday(_y, _m);   break;  // 春分の日
        case  4: if (_y ==1959) hdz= new Array(10, 29);
                 else           hdz[0] = 29;            break;  // みどりの日
        case  5: if (_y < 2007) hdz= new Array(3, 5);           // 憲法記念日 こどもの日   
                 else           hdz= new Array(3, 4, 5);break;  // みどりの日
        case  6: if (_y ==1993) hdz[0] =  9;            break;
        case  7: if (_y < 2003) hdz[0] = 20;                    // 海の日 (第３月曜日)
                 else hdz[0] = 16+ (7- _fd);            break;  
        case  8: if (_y > 2015) hdz[0] = 11;            break;// 山の日 (2016～/8/11)
        case  9: if (_y < 2003) hdz[0] = 15;            // 敬老の日 (第３月曜日), 秋分の日
                 else           hdz[0] = 16+ (7- _fd);
                 hdz[1] = calendar_getVAEday(_y, _m);   break;
        case 10: hdz[0] = 9+ (7- _fd);                  break;  // 体育の日 (第２月曜日)
        case 11: if (_y ==1990) hdz = new Array(3, 12, 23); 
                 else hdz = new Array(3, 23);           break;  // 文化の日 勤労感謝の日
        case 12: hdz[0] = 23;                           break;  // 天皇誕生日
    }
    
    hdz = calendar_valSort(hdz);
    if (_y < 1973) return hdz;

    var i, j;
    _fd--;
    for (i=0; i<hdz.length; i++) 
    {
        hdz[i] -= 0;
                
        if (_y >= 1985) 
        if (hdz[i+1] && hdz[i] - hdz[i+1] == -2)            // 国民の休日
            hdz[hdz.length] = hdz[i]+ 1;
        
        if (!((hdz[i]+ _fd) % 7))                           // 振り替え休日
        {
            if (_y < 2005) hdz[i]++;
            else 
                for (j=1; i<hdz.length; j++)
                if (hdz[i]+ j != hdz[i+j]) {
                    hdz[i] += j; break;
                }
        }
    }

    return calendar_valSort(hdz);
}

function calendar_valSort(_ary)
{
    var i, j, tmp;
    for (i=0; i<_ary.length-1; i++)
    {
        for (j=i+1; j<_ary.length; j++)
            if (_ary[j] < _ary[i]) 
            {
                tmp = _ary[j];
                _ary[j] = _ary[i];
                _ary[i] = tmp;
            }
    }
    return _ary;
}

function calendar_getDD(_y, _m)
{
    var dd      = new Array();
    var isDate  = new Date();
    var isY     = isDate.getYear();
    var isM     = isDate.getMonth()+ 1;
    var isD     = isDate.getDate();
    if (isY < 1900) isY += 1900;
    
    if (!_y || !_m) 
        dd          = calendar_getDD(isY, isM);
    else
    {
        isDate      = new Date(_y, _m- 1, 1);
        dd.year     = isDate.getYear();
        if (dd.year < 1900) dd.year += 1900;
        dd.month    = isDate.getMonth()+ 1;
        dd.firstDay = isDate.getDay();
        dd.lastDay  = calendar_getLastDate(dd.year, dd.month);
        dd.holiday  = calendar_getHoliday(dd.year, dd.month, dd.firstDay);
        dd.today    = (isY == dd.year && isM == dd.month)? isD: -1;
    }
    return dd;
}

function  calendar_getLinkDays(_y, _m)
{
    var slen= clndrVar.linkDaySuffix.length;
    var nt  = _y;
    var tmp = new Array();
    nt     +=  (_m < 10? "0": "")+ _m;
    
    for (var i in clndrLink) if (i.indexOf(nt) == slen)
        tmp[i.substring(6+slen)-0] = clndrLink[i];

    return tmp;
}

function  calendar_isReplace(_d, _f, _s)
{
    var n   = _d.indexOf(_f);
    if (n >= 0)
    {
        tmp = _d.substring(0, n);
        tmp+= _s;
        _d  = tmp + _d.substring(n+ _f.length);
    }
    return _d;
}


function calendar_mkInnrCaption(_y, _m)
{
    var capStr  = clndrVar.captionFormat;
    capStr      = calendar_isReplace(capStr, "%Y", _y);
    var tmpY    = _y % 10;
    capStr      = calendar_isReplace(capStr, "%y", tmpY<10? "0"+tmpY: tmpY);
    capStr      = calendar_isReplace(capStr, "%M", _m);
    capStr      = calendar_isReplace(capStr, "%m", _m<10? "0"+_m: _m);
    capStr      = calendar_isReplace(capStr, "%E", clndrVar.month_f[_m-1]);
    capStr      = calendar_isReplace(capStr, "%e", clndrVar.month[_m-1]);
    var l = "";
    var n = "";
    var ymL, ymR;
    
    if (!clndrVar.fixed)
    {
        if (_m == 1)    ymL = (_y-1)+ clndrVar.pDelimiter+ 12;
        else            ymL = _y+ clndrVar.pDelimiter+ (_m-1);
        if (_m == 12)   ymR = (_y+1)+ clndrVar.pDelimiter+ 1;
        else            ymR = _y+ clndrVar.pDelimiter+ (_m+1);
        
        if (document.all || document.getElementById)
        {
            ymL = calendar_isReplace(ymL, clndrVar.pDelimiter, ",");
            ymR = calendar_isReplace(ymR, clndrVar.pDelimiter, ",");
            l = "<a href='javascript:calendar_swap("+ ymL+ ")'>"+ clndrVar.lastMonthChar+"<\x2fa>";
            n = "<a href='javascript:calendar_swap("+ ymR+ ")'>"+ clndrVar.nextMonthChar+"<\x2fa>";
        }
        else if (clndrVar.oldBrwsReload)
        {
            ymL += "#"+ clndrVar.aName;
            ymR += "#"+ clndrVar.aName;
            var pt = location.pathname+ "?"+ clndrVar.queryName+ "=";
            l = "<a name='"+ clndrVar.aName+ "L' href='"+ pt+ ymL+ "L'>"+ clndrVar.lastMonthChar+"<\x2fa>";
            n = "<a name='"+ clndrVar.aName+ "N' href='"+ pt+ ymR+ "N'>"+ clndrVar.nextMonthChar+"<\x2fa>";
        }
    }
    capStr = calendar_isReplace(capStr, "%L", l);
    return   calendar_isReplace(capStr, "%N", n);
}

function calendar_mkInnrTBody(_d)
{   
    var buf     = "";
    var hIdx    = 0;
    var key     = "";
    var n       = Math.ceil((_d.firstDay+ _d.lastDay) / 7);
    var dLink   = calendar_getLinkDays(_d.year, _d.month);
    var i, j, k, tmp;
    
    for (i=0; i<n; i++)
    {
        buf += "<tr>";
        for (j=0; j<7; j++)
        {
            k = (i*7)+ j- _d.firstDay+ 1;
            if (k <= 0 || k > _d.lastDay) {
                k = clndrVar.daySpaceChar;
                key = "none";
            }
            else if (k == _d.today) 
                key = "today";
            else if (!j) 
                key = "holiday";    // sunday
            else if (k == _d.holiday[hIdx]) {
                key = "holiday";
                hIdx++;
            }
            else if (j == 6) 
                key = "saturday";
            else
                key = "def";
            
            if (dLink[k])
                k = "<a "+ dLink[k]+ ">"+ k+ "<\x2fa>";

            tmp =   clndrAttrs[key+"F"];
            buf +=  "<td "+ clndrAttrs[key] +">"
                +   (tmp? "<font "+ tmp+ ">"+ k +"<\x2ffont>": k)
                +   "<\x2ftd>";
        }
        buf     += "<\x2ftr>";
    }
    return buf;
}

function calendar_swap(_y, _m)
{
    document[document.all? "all": "getElementById"
            ](clndrAttrs.boxID).innerHTML = calendar_make(_y, _m);
}

function calendar_make(_y, _m)
{
    var d       = calendar_getDD(_y, _m);
    var capStr  = calendar_mkInnrCaption(d.year, d.month);
    var weeks   = "";
    var w       = clndrVar.weeks[clndrVar.weekLang];
    var tmp     = "";
    
    for (var i=0; i<w.length; i++)
        weeks   += "<th "+ clndrAttrs.week+ ">"
                +   (clndrAttrs.weekF? "<font "+ clndrAttrs.weekF+ ">"+ w[i]+ "<\x2ffont>": w[i])
                +   "<\x2fth>";

    return      "<table "+ clndrAttrs.table+ ">"
            +   "<caption "+ clndrAttrs.caption+ ">"+ capStr+ "<\x2fcaption>"
            +   "<thead "+ clndrAttrs.thead+ ">"
            +   "<tr onclick=\"location.href='calendar/index.html'\">" + weeks + "<\x2ftr>"
            +   "<\x2fthead>"
            +   "<tbody "+ clndrAttrs.tbody+ " onclick=\"location.href='calendar/index.html'\">"
            +   calendar_mkInnrTBody(d)
            +   "<\x2ftbody><\x2ftable>"
            ;
}

function calendar_print(y,m)
{
    var y, m;
    var n = location.search.indexOf(clndrVar.queryName+"=");
    if (clndrVar.oldBrwsReload && n > 0)
    {
        n += clndrVar.queryName.length+ 1; // 1 = "="
        var tmp = location.search.substr(n);
        n = tmp.indexOf(clndrVar.pDelimiter);
        y = tmp.substr(0, n);
        m = tmp.substr(n+ 1);
    }

    document.write(
        "<"+ clndrVar.boxElm+ " id='"+ clndrAttrs.boxID +"'>"
        + calendar_make(y,m)+ "<\x2f"+ clndrVar.boxElm+ ">"
    );
}

function calendar_getTTime(_format, _time)
{
    var dd  = new Date();
    var t   = new Array();
    if (!isNaN(_time)) dd.setTime(_time);
    t.Y     = dd.getYear();
    t.y     = t.Y % 100;
    var m   = dd.getMonth();
    t.M     = m+1;
    t.D     = dd.getDate();
    t.H     = dd.getHours();
    t.h     = t.H % 12;
    t.m     = dd.getMinutes();
    t.S     = dd.getSeconds();
    
    if (t.Y < 1900) t.Y += 1900;
    for (var i in t) if (t[i]<10) t[i] = "0"+ t[i];
    t.A     = t.H  < 12? "AM": "PM";
    t.a     = t.H  < 12? "am": "pm";
    t.E     = clndrVar.month_f[m];
    t.e     = clndrVar.month[m];
    t.j     = dd.getDay();
    t.J     = clndrVar.weeks.ja[t.j];
    t.W     = clndrVar.weeks.en_f[t.j];
    t.w     = clndrVar.weeks.en[t.j];

    return _format? calendar_sFormat(_format, t): t;
}

function calendar_setDynamicTime(_id, _format)
{
    var dom = !!document.getElementById;
    if (dom || document.all)
    {
        var o = typeof(_id) != "string"? _id:
                document[dom? "getElementById": "all"](_id);
        o.innerHTML = calendar_getTTime(_format);
        setInterval( function(){ o.innerHTML = calendar_getTTime(_format) }, 1000);
    }
}

function calendar_numComp(_a, _b) {
    return _a == _b? 0: _a < _b? -1: _a > _b? 1: void(0);
}

function calendar_sFormat(_format, _hash) 
{
    var reg = new RegExp("%(0|1|2)?([a-zA-Z])", "g");
    return _format.replace(reg, function(_m, _f, _t)
                        {
                            if (_hash[_t] === undefined) return _m;
                            else if (_f && !isNaN(_hash[_t]-0)) 
                            {
                                _t = _hash[_t]-0;
                                if (_f == 0 && _t<10) _t = "0"+ _t;
                                else if (_f == 2 && _t<10) _t = "&nbsp;"+ _t;
                                return _t;
                            }
                            else return _hash[_t];
                        });
}

function calendar_getCount(_year, _month, _date, _hour, _min, _sec)
{
    var nDD         = new Date();
    var t           = new Array();
    var isYear      = nDD.getYear();
    var isMonth     = 1;
    var isDate      = 1;
    var isHour      = 0;
    var isMin       = 0;
    var isSec       = 0;
    var mFlag       = 0;

    if (isYear<1900) isYear += 1900;
    
    if (!isNaN(_year)) 
    {
        mFlag = calendar_numComp(isYear, _year);
        isYear = _year;
        if (!isNaN(_month) && _month >= 1 && _month <=12)
        {
            if (!mFlag) mFlag = calendar_numComp(nDD.getMonth()+1, _month);
            isMonth = _month;
            if (!isNaN(_date) && _date >= 1 && _date <= calendar_getLastDate(isYear, isMonth))
            {
                if (!mFlag) mFlag = calendar_numComp(nDD.getDate(), _date);
                isDate  = _date;
                if (!isNaN(_hour) && _hour >= 0 && _hour <=24)
                {
                    if (!mFlag) mFlag = calendar_numComp(nDD.getHours(), _hour);
                    isHour  = _hour;
                    if (!isNaN(_min) && _min >= 0 && _min <=60)
                    {
                        if (!mFlag) mFlag = calendar_numComp(nDD.setMinutes(), _min);
                        isMin   = _min;
                        if (!isNaN(_sec) && _sec >= 0 && _sec <=60)
                        {
                            if (!mFlag) mFlag = calendar_numComp(nDD.getSeconds(), _sec);
                            isSec   = _sec;
    }   }   }   }   }   }

    var tDD     = new Date(isYear, isMonth-1, isDate, isHour, isMin, isSec);
    var dTime   = tDD.getTime()- nDD.getTime(); 
    if (dTime < 0) dTime *= -1;
    t.diff      = dTime;
    t.comp      = mFlag;    
    dTime       = Math.floor(dTime / 1000 );
    t.D         = Math.floor(dTime / 86400);
    t.H         = Math.floor(dTime / 3600);
    t.h         = t.H % 24;
    t.M         = Math.floor(dTime / 60);
    t.m         = t.M % 60;
    t.S         = dTime;
    t.s         = t.S % 60;
    return t;
}

function calendar_setDynamicCount()
{
    var dom = !!document.getElementById;
    if (dom || document.all)
    {
        var o = typeof(arguments[0]) != "string"? arguments[0]:
                document[dom? "getElementById": "all"](arguments[0]);
        var f = new Array();
        var d = new Array();
        var arg_i = 1;
        
        if (typeof(arguments[1]) == "string") 
        {
            f = new Array(arguments[1], arguments[2], arguments[3]);
            arg_i += 3;
        }
        else 
        {
            var idx = 0;
            for (var i in arguments[1]) 
            {
                switch (i) 
                {
                case 0: case "befor":   f["m-1"] = arguments[1][i]; break;
                case 1: case "just" :   f["m0"] = arguments[1][i]; break;
                case 2: case "after":   f["m1"] = arguments[1][i]; break;
                }
                if (++idx > 2) break;
            }
            arg_i += 1;
        }

        var reg = new RegExp("string|number");
        if ((typeof(arguments[arg_i])).match(reg) !== null) 
        {
            d.year  = arguments[arg_i+0];
            d.month = arguments[arg_i+1];
            d.date  = arguments[arg_i+2];
            d.hour  = arguments[arg_i+3];
            d.min   = arguments[arg_i+4];
            d.sec   = arguments[arg_i+5];
        }
        else for (var i in arguments[arg_i]) 
        switch (i)
        {
            case 0: case "year":    d.year  = arguments[arg_i][i]; break;
            case 1: case "month":   d.month = arguments[arg_i][i]; break;
            case 2: case "date":    d.date  = arguments[arg_i][i]; break;
            case 3: case "hour":    d.hour  = arguments[arg_i][i]; break;
            case 4: case "min":     d.min   = arguments[arg_i][i]; break;
            case 5: case "sec":     d.sec   = arguments[arg_i][i]; break;
        }

        var t = calendar_getCount(d.year, d.month, d.date, d.hour, d.min, d.sec);   
        o.innerHTML = calendar_sFormat(f["m"+t.comp], t);
        setInterval( function(){ 
                            var t = calendar_getCount(
                                    d.year, d.month, d.date, d.hour, d.min, d.sec);
                            o.innerHTML = calendar_sFormat(f["m"+t.comp], t) 
                        }, 1000);
    }
}

calendar_init();

