// グローバル変数
var flg_rokuyo = 0;								// 大安とか表示するのであれば 1、非表示なら0

var k = Math.PI / 180;
var dt = new Date(); // tzを算出するためのDateオブジェクト生成
var tz = dt.getTimezoneOffset() / 1440; // タイムゾーンオフセット
var rm_sun0; // 太陽黄経
var monthTable= new Array(31,28,31,30,31,30,31,31,30,31,30,31); //いじるな危険
var baseDate = new Date();
baseDate.setDate(1);
var drMonth = baseDate.getMonth()+1;
var drYear = baseDate.getFullYear();

// プロトタイプ宣言 - Dateオブジェクトにユリウス日(JST)を扱うメソッドを追加
Date.prototype.getJD = Date_getJD;
Date.prototype.setJD = Date_setJD;
function Date_getJD() {
	return 2440587 + this.getTime() / 864e5 - tz;
}
function Date_setJD(jd) {
	this.setTime((jd + tz - 2440587) * 864e5);
}

//=========================================================================
// 新暦に対応する、旧暦オブジェクトを作成する。（コンストラクタ）
//
// 呼び出し時にセットする変数：
//   tm : 計算する日付（JSTユリウス日）
// 戻り値：以下のプロパティに値をセットする
//   this.year	: 旧暦年
//   this.uruu	: 平月／閏月 flag .... 平月:false 閏月:true
//   this.month : 旧暦月
//   this.day	: 旧暦日
//   this.rokuyo: 六曜名
//   this.mage  : 月齢
//   this.illumi: 輝面比
//=========================================================================
function kyureki(tm) {
	var i,lap,state;
	var chu = new Array(4);
	var saku = new Array(5);
	var m = new Array(5);
	for(i = 0; i < 5; i++) m[i] = new Object;
	//-----------------------------------------------------------------------
	// 計算対象の直前にあたる二分二至の時刻を求める
	//-----------------------------------------------------------------------
	chu[0] = calc_chu(tm, 90);
	//-----------------------------------------------------------------------
	// 上で求めた二分二至の時の太陽黄経をもとに朔日行列の先頭に月名をセット
	//-----------------------------------------------------------------------
	m[0].month = Math.floor(rm_sun0 / 30) + 2;
	//-----------------------------------------------------------------------
	// 中気の時刻を計算（４回計算する）
	// chu[i]:中気の時刻
	//-----------------------------------------------------------------------
	for(i = 1; i < 4; i++) {
		chu[i] = calc_chu(chu[i - 1] + 32, 30);
	}
	//-----------------------------------------------------------------------
	// 計算対象の直前にあたる二分二至の直前の朔の時刻を求める
	//-----------------------------------------------------------------------
	saku[0] = calc_saku(chu[0]);
	//-----------------------------------------------------------------------
	// 朔の時刻を求める
	//-----------------------------------------------------------------------
	for(i = 1; i < 5; i++) {
		saku[i] = calc_saku(saku[i - 1] + 30);
		// 前と同じ時刻を計算した場合（両者の差が26日以内）には、初期値を
		// +33日にして再実行させる。
		if(Math.abs(Math.floor(saku[i - 1]) - Math.floor(saku[i])) <= 26) {
			saku[i] = calc_saku(saku[i - 1] + 35);
		}
	}
	//-----------------------------------------------------------------------
	// saku[1]が二分二至の時刻以前になってしまった場合には、朔をさかのぼり過ぎ
	// たと考えて、朔の時刻を繰り下げて修正する。
	// その際、計算もれ（saku[4]）になっている部分を補うため、朔の時刻を計算
	// する。（近日点通過の近辺で朔があると起こる事があるようだ...？）
	//-----------------------------------------------------------------------
	if( Math.floor(saku[1]) <= Math.floor(chu[0]) ) {
		for(i = 0; i < 4; i++) {
			saku[i] = saku[i + 1];
		}
		saku[4] = calc_saku(saku[3] + 35);
	}
	//-----------------------------------------------------------------------
	// saku[0]が二分二至の時刻以後になってしまった場合には、朔をさかのぼり足
	// りないと見て、朔の時刻を繰り上げて修正する。
	// その際、計算もれ（saku[0]）になっている部分を補うため、朔の時刻を計算
	// する。（春分点の近辺で朔があると起こる事があるようだ...？）
	//-----------------------------------------------------------------------
	else if( Math.floor(saku[0]) > Math.floor(chu[0]) ) {
		for(i = 4; i > 0; i--) saku[i] = saku[i - 1];
		saku[0] = calc_saku(saku[0] - 27);
	}
	//-----------------------------------------------------------------------
	// 閏月検索Ｆｌａｇセット
	// （節月で４ヶ月の間に朔が５回あると、閏月がある可能性がある。）
	// lap=false:平月  lap=true:閏月
	//-----------------------------------------------------------------------
	lap = ( Math.floor(saku[4]) <= Math.floor(chu[3]) );
	//-----------------------------------------------------------------------
	// 朔日行列の作成
	// m[i].month ... 月名（1:正月 2:２月 3:３月 ....）
	// m[i].uruu .... 閏フラグ（false:平月 true:閏月）
	// m[i].jd ...... 朔日のjd
	//-----------------------------------------------------------------------
	// m[0].month はこの関数の始めの方ですでに設定済み
	m[0].uruu = false;
	m[0].jd = Math.floor(saku[0]);
	for(i = 1; i < 5; i++) {
		if( lap && i > 1 ) {
			if( chu[i - 1] <= Math.floor(saku[i - 1])
					|| chu[i - 1] >= Math.floor(saku[i]) ) {
				m[i-1].month = m[i-2].month;
				m[i-1].uruu = true;
				m[i-1].jd = Math.floor(saku[i - 1]);
				lap = false;
			}
		}
		m[i].month = m[i-1].month + 1;
		if( m[i].month > 12 ) m[i].month -= 12;
		m[i].jd = Math.floor(saku[i]);
		m[i].uruu = false;
	}
	//-----------------------------------------------------------------------
	// 朔日行列から旧暦を求める。
	//-----------------------------------------------------------------------
	state = 0;
	for(i = 0; i < 5; i++) {
		if( Math.floor(tm) < Math.floor(m[i].jd) ) {
			state = 1;
			break;
		}
		else if( Math.floor(tm) == Math.floor(m[i].jd) ) {
			state = 2;
			break;
		}
	}
	if( state == 0 || state == 1 ) i--;

	this.uruu = m[i].uruu;
	this.month = m[i].month;
	this.day = Math.floor(tm) - Math.floor(m[i].jd) + 1;
	//-----------------------------------------------------------------------
	// 旧暦年の計算
	// （旧暦月が10以上でかつ新暦月より大きい場合には、
	//   まだ年を越していないはず...）
	//-----------------------------------------------------------------------
	var a = new Date();
	a.setJD(tm);
	this.year = a.getFullYear();
	if( this.month > 9 && this.month > a.getMonth() + 1 ) this.year--;
	//-----------------------------------------------------------------------
	// 六曜を求める
	//-----------------------------------------------------------------------
	var rokuyo = new Array("先勝","友引","先負","仏滅","大安","赤口");
	this.rokuyo = rokuyo[(this.month + this.day - 2) % 6];
	//-----------------------------------------------------------------------
	// 月齢を求める
	//-----------------------------------------------------------------------
	this.mage = tm - saku[i];
	if(this.mage < 0) this.mage = tm - saku[i-1];
	this.magenoon = Math.floor(tm) + .5 - saku[i];
	if(this.magenoon < 0) this.magenoon = Math.floor(tm) + .5 - saku[i-1];
	//-----------------------------------------------------------------------
	// 輝面比を求める
	//-----------------------------------------------------------------------
	var tm1 = Math.floor(tm);
	var tm2 = tm - tm1 + tz;
	var t = (tm2 + .5) / 36525 + (tm1 - 2451545) / 36525;
	this.illumi = (1 - Math.cos(k * NORMALIZATION_ANGLE(LONGITUDE_MOON(t) - LONGITUDE_SUN(t)))) * 50;
	//-----------------------------------------------------------------------
	// 月相を求める（輝面比の計算で求めた変数 t を使用）
	//-----------------------------------------------------------------------
	this.mphase = Math.floor(NORMALIZATION_ANGLE(LONGITUDE_MOON(t) - LONGITUDE_SUN(t)) / 360 * 28 + .5);
	if(this.mphase == 28) this.mphase = 0;
}

//=========================================================================
// 直前の二分二至／中気の時刻を求める
//
// パラメータ
//   tm ............ 計算基準となる時刻（JSTユリウス日）
//   longitude ..... 求める対象（90:二分二至,30:中気））
// 戻り値
//   求めた時刻（JSTユリウス日）を返す。
//   グローバル変数 rm_sun0 に、その時の太陽黄経をセットする。
//
// ※ 引数、戻り値ともユリウス日で表し、時分秒は日の小数で表す。
//    力学時とユリウス日との補正時刻=0.0secと仮定
//=========================================================================
function calc_chu(tm, longitude) {
	var tm1,tm2,t,rm_sun,delta_rm;
	//-----------------------------------------------------------------------
	// 時刻引数を小数部と整数部とに分解する（精度を上げるため）
	//-----------------------------------------------------------------------
	tm1 = Math.floor(tm);
	tm2 = tm - tm1 + tz; // JST -> UTC
	//-----------------------------------------------------------------------
	// 直前の二分二至の黄経 λsun0 を求める
	//-----------------------------------------------------------------------
	t = (tm2 + .5) / 36525 + (tm1 - 2451545) / 36525;
	rm_sun = LONGITUDE_SUN(t);
	rm_sun0 = longitude * Math.floor(rm_sun / longitude);
	//-----------------------------------------------------------------------
	// 繰り返し計算によって直前の二分二至の時刻を計算する
	// （誤差が±1.0 sec以内になったら打ち切る。）
	//-----------------------------------------------------------------------
	var delta_t1 = 0, delta_t2 = 1;
	for( ; Math.abs(delta_t1 + delta_t2) > (1 / 86400); ) {
		//-------------------------------------------------------------------
		// λsun(t) を計算
		//   t = (tm + .5 - 2451545) / 36525;
		//-------------------------------------------------------------------
		t = (tm2 + .5) / 36525 + (tm1 - 2451545) / 36525;
		rm_sun = LONGITUDE_SUN(t);
		//-------------------------------------------------------------------
		// 黄経差 Δλ＝λsun －λsun0
		//-------------------------------------------------------------------
		delta_rm = rm_sun - rm_sun0 ;
		//-------------------------------------------------------------------
		// Δλの引き込み範囲（±180°）を逸脱した場合には、補正を行う
		//-------------------------------------------------------------------
		if( delta_rm > 180 ) {
			delta_rm -= 360;
		} else if( delta_rm < -180 ) {
			delta_rm += 360;
		}
		//-------------------------------------------------------------------
		// 時刻引数の補正値 Δt
		// delta_t = delta_rm * 365.2 / 360;
		//-------------------------------------------------------------------
		delta_t1 = Math.floor(delta_rm * 365.2 / 360);
		delta_t2 = delta_rm * 365.2 / 360 - delta_t1;
		//-------------------------------------------------------------------
		// 時刻引数の補正
		// tm -= delta_t;
		//-------------------------------------------------------------------
		tm1 = tm1 - delta_t1;
		tm2 = tm2 - delta_t2;
		if( tm2 < 0 ) {
			tm1 -= 1;
			tm2 += 1;
		}
	}
	//-----------------------------------------------------------------------
	// 戻り値の作成
	//   時刻引数を合成し、戻り値（JSTユリウス日）とする
	//-----------------------------------------------------------------------
	return tm2 + tm1 - tz;
}

//=========================================================================
// 直前の朔の時刻を求める
//
// 呼び出し時にセットする変数
//   tm ........ 計算基準の時刻（JSTユリウス日）
// 戻り値
//   朔の時刻
//
// ※ 引数、戻り値ともJSTユリウス日で表し、時分秒は日の小数で表す。
//    力学時とユリウス日との補正時刻=0.0secと仮定
//=========================================================================
function calc_saku(tm) {
	var lc,t,tm1,tm2,rm_sun,rm_moon,delta_rm;
	//-----------------------------------------------------------------------
	// ループカウンタのセット
	//-----------------------------------------------------------------------
	lc = 1;
	//-----------------------------------------------------------------------
	// 時刻引数を小数部と整数部とに分解する（精度を上げるため）
	//-----------------------------------------------------------------------
	tm1 = Math.floor(tm);
	tm2 = tm - tm1 + tz;	// JST -> UTC
	//-----------------------------------------------------------------------
	// 繰り返し計算によって朔の時刻を計算する
	// （誤差が±1.0 sec以内になったら打ち切る。）
	//-----------------------------------------------------------------------
	var delta_t1 = 0, delta_t2 = 1;
	for( ; Math.abs( delta_t1 + delta_t2 ) > ( 1 / 86400 ) ; lc++) {
		//-------------------------------------------------------------------
		// 太陽の黄経λsun(t) ,月の黄経λmoon(t) を計算
		//   t = (tm + .5 - 2451545) / 36525;
		//-------------------------------------------------------------------
		t = (tm2 + .5) / 36525 + (tm1 - 2451545) / 36525;
		rm_sun = LONGITUDE_SUN(t);
		rm_moon = LONGITUDE_MOON(t);
		//-------------------------------------------------------------------
		// 月と太陽の黄経差Δλ
		// Δλ＝λmoon－λsun
		//-------------------------------------------------------------------
		delta_rm = rm_moon - rm_sun ;
		//-------------------------------------------------------------------
		// ループの１回目（lc=1）で delta_rm < 0 の場合には引き込み範囲に
		// 入るように補正する
		//-------------------------------------------------------------------
		if( lc==1 && delta_rm < 0 ) {
			delta_rm = NORMALIZATION_ANGLE(delta_rm);
		}
		//-------------------------------------------------------------------
		// 春分の近くで朔がある場合（0 ≦λsun≦ 20）で、
		// 月の黄経λmoon≧300 の場合には、
		// Δλ＝ 360 － Δλ と計算して補正する
		//-------------------------------------------------------------------
		else if( rm_sun >= 0 && rm_sun <= 20 && rm_moon >= 300 ) {
			delta_rm = NORMALIZATION_ANGLE(delta_rm);
			delta_rm = 360 - delta_rm;
		}
		//-------------------------------------------------------------------
		// Δλの引き込み範囲（±40°）を逸脱した場合には、補正を行う
		//-------------------------------------------------------------------
		else if( Math.abs(delta_rm) > 40 ) {
			delta_rm = NORMALIZATION_ANGLE(delta_rm);
		}
		//-------------------------------------------------------------------
		// 時刻引数の補正値 Δt
		// delta_t = delta_rm * 29.530589 / 360;
		//-------------------------------------------------------------------
		delta_t1 = Math.floor(delta_rm * 29.530589 / 360);
		delta_t2 = delta_rm * 29.530589 / 360 - delta_t1;
		//-------------------------------------------------------------------
		// 時刻引数の補正
		// tm -= delta_t;
		//-------------------------------------------------------------------
		tm1 = tm1 - delta_t1;
		tm2 = tm2 - delta_t2;
		if( tm2 < 0 ) {
			tm1 -= 1;
			tm2 += 1;
		}
		//-------------------------------------------------------------------
		// ループ回数が15回になったら、初期値 tm を tm-26 とする。
		//-------------------------------------------------------------------
		if( lc == 15 && Math.abs(delta_t1 + delta_t2) > (1 / 86400) ) {
			tm1 = Math.floor(tm - 26);
			tm2 = 0;
		}
		//-------------------------------------------------------------------
		// 初期値を補正したにも関わらず、振動を続ける場合には初期値を答えとし
		// て返して強制的にループを抜け出して異常終了させる。
		//-------------------------------------------------------------------
		else if( lc > 30 && Math.abs(delta_t1 + delta_t2) > (1 / 86400) ) {
			tm1 = tm;
			tm2 = 0;
			break;
		}
	}
	//-----------------------------------------------------------------------
	// 戻り値の作成
	//   時刻引数を合成し、戻り値（ユリウス日）とする
	//-----------------------------------------------------------------------
	return tm2 + tm1 - tz;
}

//=========================================================================
// 角度の正規化を行う。すなわち引数の範囲を ０≦θ＜３６０ にする。
//=========================================================================
function NORMALIZATION_ANGLE(angle) {
	return angle - 360 * Math.floor(angle / 360);
}

//=========================================================================
// 太陽の黄経 λsun(t) を計算する（t は力学時）
//=========================================================================
function LONGITUDE_SUN(t) {
	var ang,th;
	with(Math) {
	//-----------------------------------------------------------------------
	// 摂動項の計算
	//-----------------------------------------------------------------------
	th = .0004 * cos( k * NORMALIZATION_ANGLE( 31557 * t + 161 ) );
	th += .0004 * cos( k * NORMALIZATION_ANGLE( 29930 * t + 48 ) );
	th += .0005 * cos( k * NORMALIZATION_ANGLE( 2281 * t + 221 ) );
	th += .0005 * cos( k * NORMALIZATION_ANGLE( 155 * t + 118 ) );
	th += .0006 * cos( k * NORMALIZATION_ANGLE( 33718 * t + 316 ) );
	th += .0007 * cos( k * NORMALIZATION_ANGLE( 9038 * t + 64 ) );
	th += .0007 * cos( k * NORMALIZATION_ANGLE( 3035 * t + 110 ) );
	th += .0007 * cos( k * NORMALIZATION_ANGLE( 65929 * t + 45 ) );
	th += .0013 * cos( k * NORMALIZATION_ANGLE( 22519 * t + 352 ) );
	th += .0015 * cos( k * NORMALIZATION_ANGLE( 45038 * t + 254 ) );
	th += .0018 * cos( k * NORMALIZATION_ANGLE( 445267 * t + 208 ) );
	th += .0018 * cos( k * NORMALIZATION_ANGLE( 19 * t + 159 ) );
	th += .0020 * cos( k * NORMALIZATION_ANGLE( 32964 * t + 158 ) );
	th += .0200 * cos( k * NORMALIZATION_ANGLE( 71998.1 * t + 265.1 ) );
	ang = NORMALIZATION_ANGLE( 35999.05 * t + 267.52 );
	th = th - .0048 * t * cos( k * ang ) ;
	th += 1.9147 * cos( k * ang ) ;
	//-----------------------------------------------------------------------
	// 比例項の計算
	//-----------------------------------------------------------------------
	ang = NORMALIZATION_ANGLE( 36000.7695 * t );
	ang = NORMALIZATION_ANGLE( ang + 280.4659 );
	th = NORMALIZATION_ANGLE( th + ang );
	}
	return th;
}

//=========================================================================
// 月の黄経 λmoon(t) を計算する（t は力学時）
//=========================================================================
function LONGITUDE_MOON(t) {
	var ang,th;
	with(Math) {
	//-----------------------------------------------------------------------
	// 摂動項の計算
	//-----------------------------------------------------------------------
	th = .0003 * cos( k * NORMALIZATION_ANGLE( 2322131 * t + 191 ) );
	th += .0003 * cos( k * NORMALIZATION_ANGLE( 4067 * t + 70 ) );
	th += .0003 * cos( k * NORMALIZATION_ANGLE( 549197 * t + 220 ) );
	th += .0003 * cos( k * NORMALIZATION_ANGLE( 1808933 * t + 58 ) );
	th += .0003 * cos( k * NORMALIZATION_ANGLE( 349472 * t + 337 ) );
	th += .0003 * cos( k * NORMALIZATION_ANGLE( 381404 * t + 354 ) );
	th += .0003 * cos( k * NORMALIZATION_ANGLE( 958465 * t + 340 ) );
	th += .0004 * cos( k * NORMALIZATION_ANGLE( 12006 * t + 187 ) );
	th += .0004 * cos( k * NORMALIZATION_ANGLE( 39871 * t + 223 ) );
	th += .0005 * cos( k * NORMALIZATION_ANGLE( 509131 * t + 242 ) );
	th += .0005 * cos( k * NORMALIZATION_ANGLE( 1745069 * t + 24 ) );
	th += .0005 * cos( k * NORMALIZATION_ANGLE( 1908795 * t + 90 ) );
	th += .0006 * cos( k * NORMALIZATION_ANGLE( 2258267 * t + 156 ) );
	th += .0006 * cos( k * NORMALIZATION_ANGLE( 111869 * t + 38 ) );
	th += .0007 * cos( k * NORMALIZATION_ANGLE( 27864 * t + 127 ) );
	th += .0007 * cos( k * NORMALIZATION_ANGLE( 485333 * t + 186 ) );
	th += .0007 * cos( k * NORMALIZATION_ANGLE( 405201 * t + 50 ) );
	th += .0007 * cos( k * NORMALIZATION_ANGLE( 790672 * t + 114 ) );
	th += .0008 * cos( k * NORMALIZATION_ANGLE( 1403732 * t + 98 ) );
	th += .0009 * cos( k * NORMALIZATION_ANGLE( 858602 * t + 129 ) );
	th += .0011 * cos( k * NORMALIZATION_ANGLE( 1920802 * t + 186 ) );
	th += .0012 * cos( k * NORMALIZATION_ANGLE( 1267871 * t + 249 ) );
	th += .0016 * cos( k * NORMALIZATION_ANGLE( 1856938 * t + 152 ) );
	th += .0018 * cos( k * NORMALIZATION_ANGLE( 401329 * t + 274 ) );
	th += .0021 * cos( k * NORMALIZATION_ANGLE( 341337 * t + 16 ) );
	th += .0021 * cos( k * NORMALIZATION_ANGLE( 71998 * t + 85 ) );
	th += .0021 * cos( k * NORMALIZATION_ANGLE( 990397 * t + 357 ) );
	th += .0022 * cos( k * NORMALIZATION_ANGLE( 818536 * t + 151 ) );
	th += .0023 * cos( k * NORMALIZATION_ANGLE( 922466 * t + 163 ) );
	th += .0024 * cos( k * NORMALIZATION_ANGLE( 99863 * t + 122 ) );
	th += .0026 * cos( k * NORMALIZATION_ANGLE( 1379739 * t + 17 ) );
	th += .0027 * cos( k * NORMALIZATION_ANGLE( 918399 * t + 182 ) );
	th += .0028 * cos( k * NORMALIZATION_ANGLE( 1934 * t + 145 ) );
	th += .0037 * cos( k * NORMALIZATION_ANGLE( 541062 * t + 259 ) );
	th += .0038 * cos( k * NORMALIZATION_ANGLE( 1781068 * t + 21 ) );
	th += .0040 * cos( k * NORMALIZATION_ANGLE( 133 * t + 29 ) );
	th += .0040 * cos( k * NORMALIZATION_ANGLE( 1844932 * t + 56 ) );
	th += .0040 * cos( k * NORMALIZATION_ANGLE( 1331734 * t + 283 ) );
	th += .0050 * cos( k * NORMALIZATION_ANGLE( 481266 * t + 205 ) );
	th += .0052 * cos( k * NORMALIZATION_ANGLE( 31932 * t + 107 ) );
	th += .0068 * cos( k * NORMALIZATION_ANGLE( 926533 * t + 323 ) );
	th += .0079 * cos( k * NORMALIZATION_ANGLE( 449334 * t + 188 ) );
	th += .0085 * cos( k * NORMALIZATION_ANGLE( 826671 * t + 111 ) );
	th += .0100 * cos( k * NORMALIZATION_ANGLE( 1431597 * t + 315 ) );
	th += .0107 * cos( k * NORMALIZATION_ANGLE( 1303870 * t + 246 ) );
	th += .0110 * cos( k * NORMALIZATION_ANGLE( 489205 * t + 142 ) );
	th += .0125 * cos( k * NORMALIZATION_ANGLE( 1443603 * t + 52 ) );
	th += .0154 * cos( k * NORMALIZATION_ANGLE( 75870 * t + 41 ) );
	th += .0304 * cos( k * NORMALIZATION_ANGLE( 513197.9 * t + 222.5 ) );
	th += .0347 * cos( k * NORMALIZATION_ANGLE( 445267.1 * t + 27.9 ) );
	th += .0409 * cos( k * NORMALIZATION_ANGLE( 441199.8 * t + 47.4 ) );
	th += .0458 * cos( k * NORMALIZATION_ANGLE( 854535.2 * t + 148.2 ) );
	th += .0533 * cos( k * NORMALIZATION_ANGLE( 1367733.1 * t + 280.7 ) );
	th += .0571 * cos( k * NORMALIZATION_ANGLE( 377336.3 * t + 13.2 ) );
	th += .0588 * cos( k * NORMALIZATION_ANGLE( 63863.5 * t + 124.2 ) );
	th += .1144 * cos( k * NORMALIZATION_ANGLE( 966404 * t + 276.5 ) );
	th += .1851 * cos( k * NORMALIZATION_ANGLE( 35999.05 * t + 87.53 ) );
	th += .2136 * cos( k * NORMALIZATION_ANGLE( 954397.74 * t + 179.93 ) );
	th += .6583 * cos( k * NORMALIZATION_ANGLE( 890534.22 * t + 145.7 ) );
	th += 1.2740 * cos( k * NORMALIZATION_ANGLE( 413335.35 * t + 10.74 ) );
	th += 6.2888 * cos( k * NORMALIZATION_ANGLE( 477198.868 * t + 44.963 ) );
	//-----------------------------------------------------------------------
	// 比例項の計算
	//-----------------------------------------------------------------------
	ang = NORMALIZATION_ANGLE( 481267.8809 * t );
	ang = NORMALIZATION_ANGLE( ang + 218.3162 );
	th = NORMALIZATION_ANGLE( th + ang );
	}
	return th
}


//祝日いじるときはフォーマットは以下のような感じで
//case 月-1:
//  Holiday( year, 月, 日, "祝日名<br>" );
//  Holiday( year, 月, calDate(year, 月, 週, 曜日0(sun)..6(sat)), "祝日名<br>" );
//  break;
function setHolliday( year, month, len ){
	var i, tmp;

	//振替休日，国民の休日計算用領域確保
	holDate  = new Array(MAXEVENT);
	hi = 0;

	for(i=0; i<=len; i++){
		switch( month ){
			case  0:
				Holiday( year, 1, 1, "元日<br>" );
				Holiday( year, 1, calDate(year, 1, 2, 1), "成人の日<br>" ); //1月第2月曜日
				break;
			case  1:
				Holiday( year, 2, 11, "建国記念の日<br>" );
				break;
			case  2:
				Holiday( year, 3, vernal(year), "春分の日<br>" );
				break;
			case  3:
				Holiday( year, 4, 29, "昭和の日<br>" );
				break;
			case  4:
				Holiday( year, 5, 3, "憲法記念日<br>" );
				Holiday( year, 5, 4, "みどりの日<br>" );
				Holiday( year, 5, 5, "こどもの日<br>" );
				break;
			case  6:
				Holiday( year, 7, calDate(year, 7, 3, 1), "海の日<br>" ); //7月第3月曜日
				break;
			case 7:
				Holiday( year, 8, 11, "山の日<br>" );//8月11日
				break;
				
			case  8:
				Holiday( year, 9, calDate(year, 9, 3, 1), "敬老の日<br>" ); //9月第3月曜日
				Holiday( year, 9, autumn(year), "秋分の日<br>" );
				break;
			case  9:
				Holiday( year, 10, calDate(year, 10, 2, 1), "体育の日<br>" ); //10月第2月曜日
				break;
			case 10:
				Holiday( year, 11,  3, "文化の日<br>" );
				Holiday( year, 11, 23, "勤労感謝の日<br>" );
				break;
			case 11:
				Holiday( year, 12, 23, "天皇誕生日<br>" );
				break;
			
		}
		year = year + Math.floor((month+1)/12);
		month = (month+1)%12;
	}

	for(i=0; i<hi; i++){
		if( holDate[i].getDay() == 0 ){
			tmp = moveDate(holDate[i],1);
			i++;
			while( i<hi && 
							tmp.getDate()  == holDate[i].getDate()  &&
							tmp.getMonth() == holDate[i].getMonth() &&
							tmp.getYear()  == holDate[i].getYear()  ){
				tmp = moveDate(tmp,1);
				i++;
			}
			newEvent( tmp, "class='holiday'", "振替休日<br>" );
			i--;
		}
	}

	for(i=1; i<hi; i++){
		tmp = moveDate(holDate[i-1], 2);
		if( tmp.getDate()  == holDate[i].getDate()  &&
				tmp.getMonth() == holDate[i].getMonth() &&
				tmp.getYear()  == holDate[i].getYear()  ){
			tmp = tmp.getDay();
			if( tmp!=1 && tmp!=2 ){
				tmp = moveDate(holDate[i-1], 1);
				newEvent( tmp, "class='holiday'", "国民の休日<br>" );
			}
		}
	}
}

//year年month月 第week day曜日の計算
function calDate( year, month, week, day ){
	var tmp, day1;

	tmp = new Date(year, month-1, 1);
	day1 = tmp.getDay();
	tmp = 1 + day - day1 + week*7;
	if( day - day1 >= 0 ) tmp = tmp - 7;
	return tmp;
}

// 春分の日を求める(2000～2099) 確実である保証はないと思う
function vernal( year ){
	var tmp = Math.floor( 20.69115 + 0.242194 * (year - 2000)
	                   - Math.floor((year - 2000)/4) );
	return tmp;
}

// 秋分の日を求める(2000～2099) 確実である保証はないと思う
function autumn( year ){
 var tmp = Math.floor( 23.09 + 0.242194 * (year - 2000)
                       - Math.floor((year - 2000)/4) );
 return tmp;
}

function newEvent( date, sel, name ){
	if( si >= MAXEVENT ) return;
	sdlDate[si]  = date;
	sdlSel[si]   = sel;
	sdlName[si]  = name;
	si++;
}

function newSchedule( year, month, date, sel, name ){
	newEvent( new Date( year, month-1, date ), sel, name );
}

function Holiday( year, month, date, name ){
	var i, tmp;
	month--;
	tmp = new Date( year, month, date );
	newEvent( tmp, "class='holiday'", name );

	//振替休日、国民の休日計算用データ登録
	if( hi >= MAXEVENT ) return;
	//インサーションソート
	for( i=hi-1; i>=0 && holDate[i].getMonth() == month && holDate[i].getDate() > date;i-- ){
		holDate[i+1]  =  holDate[i];
	}
	holDate[i+1]  =  tmp;
	hi++;
}

//dateを基準にdis日動かした日を返す
function moveDate( date, dis ){
	var d, m, y;

	d = date.getDate();
	m = date.getMonth();
	y = date.getFullYear();
	if ( ((y%4)==0 && (y%100)!=0) || (y%400)==0 ) //うるうの判定(2000～)
		monthTable[1] = 29;
	else  monthTable[1] = 28;

	d = d + dis;
	while( d > monthTable[m]){
		d = d - monthTable[m];
		m++;
		if( m > 11 ){
			m=0;
			y++;
			if ( ((y%4)==0 && (y%100)!=0) || (y%400)==0 ) //うるうの判定(2000～)
			monthTable[1] = 29;
			else  monthTable[1] = 28;
		}
	}
	while( d < 0 ){
		m--;
		if( m < 0 ){
			m=11;
			y--;
			if ( ((y%4)==0 && (y%100)!=0) || (y%400)==0 ) //うるうの判定(2000～)
				monthTable[1] = 29;
			else  monthTable[1] = 28;
		}
		d = d + monthTable[m];
	}
	return (new Date(y,m,d));
}


//Main関数
function showCalendar( argDate ){
  var i, j, k, tmpDate;
  
  tmp = argDate.getMonth() + 1;
//  document.formSdlCal.dateInput.value = argDate.getFullYear() + "/" + tmp + "/" + argDate.getDate();
//  document.formSdlCal.dateInput.value = argDate.getFullYear() + "/" + tmp + "/1";
  
  //スケジュール登録用領域確保
  sdlDate  = new Array(MAXEVENT);
  sdlSel   = new Array(MAXEVENT);
  sdlName  = new Array(MAXEVENT);
  si = 0;
  
  //覚えとく
  baseDate = argDate;
  //argDateの週の日曜日から表示する
  tmpDate = moveDate( argDate, -argDate.getDay() );
  //"今日"を記憶
  toDate = new Date();
  
  //表示する可能性のある (SHOWWEEK/4)+2ヶ月先まで祝日を登録
  setHolliday( tmpDate.getFullYear(), tmpDate.getMonth(), Math.floor(SHOWWEEK/4)+2 );
  
  //スケジュールを登録
  setSchedules();
  
  
  //描画用コード開始
  docubuf = "<h2><font color='#993333'>"+drYear+"/"+drMonth+"</font></h2>";
  docubuf += "<table width=\"90%\" class='cal'>";
  //曜日
  docubuf += "<tr>";
  for(i=0; i<7; i++){
    docubuf += "<td align='center' ";
    if(i==0)      docubuf += "class ='sun'><b>" + weekTable[i] + "</b>";
    else if(i==6) docubuf += "class ='sat'><b>" + weekTable[i] + "</b>";
    else          docubuf += "class ='mon'><b>" + weekTable[i] + "</b>";
    docubuf += "</td>";
  }
  docubuf += "</tr>";
  
  ///日付
  for(i=0; i<SHOWWEEK; i++){
    docubuf += "<tr class='caltr'>";
    for(j=0; j<7; j++){
      docubuf += "<td ";
      
      //セル色は最後に登録したの優先．
      for(k=si-1; k>=0; k--)
        if( sdlDate[k].getDate()  == tmpDate.getDate()  &&
            sdlDate[k].getMonth() == tmpDate.getMonth() &&
            sdlDate[k].getYear()  == tmpDate.getYear() &&
            sdlSel[k] != ""
          )
          break;
      
      //セル色設定
      if( tmpDate.getDate()  == toDate.getDate()  &&
          tmpDate.getMonth() == toDate.getMonth() &&
          tmpDate.getYear() == toDate.getYear()    )
                        docubuf += "class='today'>";
      else if( k >= 0 ) docubuf += sdlSel[k] + ">";
      else if(j==0)     docubuf += "class='holiday'>";
      else if(j==6)     docubuf += "class='saturday'>";
      else              docubuf += "class='usualday'>";
      
      //日付表示
      docubuf += "<b>";
      
       if( tmpDate.getMonth()!= drMonth-1 )
       {
   		   docubuf += "<font color='#666666'>";
   		}
     
      //年初めは年から表示
      if( tmpDate.getDate()==1 && tmpDate.getMonth()==0 )
        docubuf += tmpDate.getFullYear() + "/";
      //最初と月初めは月から表示
      if( tmpDate.getDate()==1 || (i==0 && j==0) )
        docubuf += tmpDate.getMonth()+1 + "/";
      //普通は日だけ表示
      docubuf += tmpDate.getDate() + "</b><br>";
      
	if (flg_rokuyo) {			// 大安とか表示する所
 	   var kr = new kyureki(tmpDate.getJD());
		docubuf += "<font size='-1'>" + kr.rokuyo + "</font><br>";
	}
	
      
      //スケジュール埋め込み．複数あったら全部．登録順．
      for(k=0; k<si; k++)
        if( sdlDate[k].getDate()  == tmpDate.getDate()
            && sdlDate[k].getMonth() == tmpDate.getMonth()
            && sdlDate[k].getYear()  == tmpDate.getYear()
          )
          docubuf += sdlName[k];
             if( tmpDate.getMonth()!= drMonth-1 )
       {
   		   docubuf += "<font color='#993333'>";
   		}

      //日を進める
      tmpDate = moveDate( tmpDate, 1 );
      
      docubuf += "</td>";
    }
    docubuf += "</tr>";
  }
  docubuf += "</table>";
  
  divSdlCal.innerHTML = docubuf;

}
//dateを基準にdis日動かした日を返す
function nextMonth( date ){
	var d, m, y;
	var tmp;

	d = 1;
	m = date.getMonth() + 1;
	y = date.getFullYear();
	tmp = new Date(y, m, d);
	if (m > 11) {
		m = 0;
		y = y + 1;
	}
	drMonth = m + 1;
	drYear = y;
	return (new Date(y,m,d));
}
function prevMonth( date ){
	var d, m, y;
	var tmp;

	d = 1;
	m = date.getMonth() - 1;
	y = date.getFullYear();
	if (m < 0) {
		m = 11;
		y = y - 1;
	}
	tmp = new Date(y, m, d);
	drMonth = m + 1;
	drYear = y;
	return (new Date(y,m,d));
}
function today_cal(){
	var tmp;

	tmp = new Date();
	drMonth = tmp.getMonth() + 1;
	drYear = tmp.getFullYear();
//	return (new Date());
	return (new Date(drYear,drMonth-1,1));
}
