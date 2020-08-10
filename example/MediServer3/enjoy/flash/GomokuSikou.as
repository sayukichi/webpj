package {
	import flash.display.MovieClip;
	public class GomokuSikou extends GomokuBan {
		public var bestTe:Array=new Array();
		public var kaisu:int=0;
		public var lv:int=1;
		public function GomokuSikou(level:int) {
			lv=level;
			for(var i:uint=0; i<10; i++) bestTe[i]=new Array();
		}
		
		public function Think(pl:uint, k:GomokuKyokumen) {
			var kk:GomokuKyokumen=new GomokuKyokumen(k.placed, k.ban, k.hantei, k.ev, k.lv);
			var bestTe:int=0;
			var bestVal:int=-100000;
			var cand:Array=new Array();
			for(i=0; i<vnum*hnum; i++) if(kk.hantei[i]==1) cand.push(i);
			for(i=0; i<cand.length; i++) {
				//var km:Kyokumen=new Kyokumen(kk.hashSeed, kk.handHashSeed, 0, kk.ban, kk.Hand, kk.controlE, kk.controlS, kk.val, 1);
				//km.moveForward(ENEMY, kk.teArray[i]);
				//var val:int=AlphaBeta(SELF, km, bestVal, 10000, 0, 1);
				//	var kkm:KyokumenKomagumi=new KyokumenKomagumi(km.ban, km.Hand);
				//	var val:int=km.val+kkm.val+km.evalGain(kk.teArray[i].to);
	//if(i==0) trace("そうだよそうだよ"+kk.teArray[0].from+","+kk.teArray[0].to);
				//	var val:int=MinMax(SELF, km, 2, 0, i);
	//trace("waratta"+kk.teArray[i].from+","+kk.teArray[i].to+","+val);
				//if(val>bestVal) {
					//bestTe=i;
					//bestVal=val;
				//}
			}
			
			var ret:int=-1; //PLAYERの脅威を防ぐ手
			var th:Array=kk.threat_investigate(SELF);
			var selfmake:Array=new Array();
			var selffour:Array=new Array();
			var selfthree:Array=new Array();
			if(th.length>0) {//trace("minmi");
				//var nm:Array=new Array();
				for(i=0; i<th.length; i++) {
					if(th[i][0][0]==1) { //straight four
						for(j=0; j<th[i][0].length-1; j++) {
							selfmake.push(th[i][0][j+1]);
						}
					}
					else if(th[i][0][0]==2) {
						for(j=0; j<th[i][0].length-1; j++) {
							selffour.push(th[i][0][j+1]);
						}
					}
					else if(th[i][0][0]==3) {
						//trace("selfthree");
						for(j=0; j<th[i][0].length-1; j++) {
							selfthree.push(th[i][0][j+1]);
						}
					}
					//for(j=0; j<th[i].length; j++) {
						//nm.push(th[i][j]);
					//}
				}
				//ret=nm[Math.floor(Math.random()*nm.length)];
			}
			var ar:Array=new Array();
			ar=kk.makeThreatHand(ENEMY);  //COMが脅威をつくる手
			
			var five:Array=new Array();
			var four:Array=new Array();
			var threat:Array=new Array();
			var threat2com:Array=new Array();
			var threat2pure:Array=new Array();
			if(ar.length>0) {
				var nm:int=0;
				for(i=0; i<ar.length; i++) {
					
				    if(ar[i][1][0][0]!=2) threat.push(ar[i][0]);
					if(ar[i][1].length>1) {
						if(ar[i][1][0][0]==1 || ar[i][1][0][0]==2 || ar[i][1][1][0]==1 || ar[i][1][1][0]==2) {
							threat2pure.push(ar[i][0]);
						}
						else threat2com.push(ar[i][0]);
					}
					if(ar[i][1][0][0]==0) { //five
						five.push(ar[i][0]);
					}
					else if(ar[i][1][0][0]==1) { //straight four
						four.push(ar[i][0]);
					}
					else if(ar[i][1][0][0]==3) {
						threat.push(ar[i][0]);
					}
				}
			}
			
			
			
			ar=kk.makeThreatHand(SELF);
					
			var prevent_selfthreat2:Array=new Array();
			if(ar.length>0) {
				nm=0;
				for(i=0; i<ar.length; i++) {//trace(ar[i][1].length+",,,,");
					if(ar[i][1].length>1) {
						prevent_selfthreat2.push(ar[i][0]);
					}
					else if(ar[i][1][0][0]==1) {
						prevent_selfthreat2.push(ar[i][0]);
					}
					/*if(ar[i][1][0][0][0]==0) { //five
						trace("nn");
						five.push(ar[i][0]);
					}
					else if(ar[i][1][0][0][0]==1) { //straight four
						trace("dd");
						four.push(ar[i][0]);
					}
					else if(ar[i][1][0][0][0]==2 || ar[i][1][0][0][0]==3) {
						threat.push(ar[i][0]);
					}*/
				}
			}
	
	
			if(five.length>0) {
				//trace("comのかち");
				ret=five[Math.floor(Math.random()*five.length)];
			}
			else if(selfmake.length>0) {
				//trace("COMのまけ");
				ret=selfmake[Math.floor(Math.random()*selfmake.length)];
			}
			else if(selffour.length>0) { //PLAYERのfour(not straight)を阻止→最優先事項
				//trace("あぶない"+selffour);
				ret=selffour[Math.floor(Math.random()*selffour.length)];
			}
			else if(four.length>0) { //straight four 完成か、あるいは2つ以上のthreat(pure）の完成→COMの実質的勝利
				ret=four[Math.floor(Math.random()*four.length)];
			}
			else if(threat2pure.length>0) {
				ret=threat2pure[Math.floor(Math.random()*threat2pure.length)];
			}
			
			else if(selfthree.length>0) { //PLAYERのthreatを阻止
				var evplace:int=0;
				for(i=0; i<selfthree.length; i++) {
					var evp:int=kk.ev[selfthree[i]];
					if(evp>evplace) evplace=evp;
				}
				for(i=0; i<selfthree.length; i++) {
					if(kk.ev[selfthree[i]]==evplace) ret=selfthree[i];
				}
				
				//trace("脅威を阻止！"+selfthree);
			}
			else if(prevent_selfthreat2.length>0 && lv==2) { //PLAYERのdouble threatを阻止
				ret=prevent_selfthreat2[Math.floor(Math.random()*prevent_selfthreat2.length)];
				//trace("playerのダブルを阻止");
			}
			else if(threat2com.length>0) {
				ret=threat2com[Math.floor(Math.random()*threat2com.length)];
			}
			else {
				if(lv==1 && threat.length>0) { //脅威を形成
					evplace=0;
					for(i=0; i<threat.length; i++) {
						evp=kk.ev[threat[i]];
						if(evp>evplace) evplace=evp;
					}
					for(i=0; i<threat.length; i++) {
						if(kk.ev[threat[i]]==evplace) ret=threat[i];
					}
				}
				else {
				
					var max:int=-10000;
					for(i=0; i<cand.length; i++) {
						//kk.find_sequence(ENEMY);
						kk.moveForward(ENEMY, cand[i]);
						var thpt:int=0;
						for(j=0; j<threat.length; j++) {
							if(threat[j]==cand[j]) thpt+=30;
						}
						if(kk.val+thpt>max) {
							max=kk.val;
							ret=cand[i];
						}
						kk.moveBack(ENEMY, cand[i]);
						kk.eval_replenish(cand[i]);
					}
					
				}
				/*evplace=0;
				for(i=0; i<cand.length; i++) {
					evp=kk.ev[cand[i]];
					if(evp>evplace) evplace=evp;
				}
				for(i=0; i<cand.length; i++) {
					if(kk.ev[cand[i]]==evplace) ret=cand[i];
				}*/
				//ret=cand[Math.floor(Math.random()*cand.length)];
			}
			return(ret);
		//	
		//	var val:int=MinMax(ENEMY, kk, 0, 1);
			//return(kk.teArray[bestTe]);
		}
		
		
		
	




		
		//public function AlphaBeta(pl:uint, k:Kyokumen, alpha:int, beta:int, depth:int, depthMax:int) {
			/*if(depth==depthMax) {kaisu++;
				var km:KyokumenKomagumi=new KyokumenKomagumi(k.ban, k.Hand);
				return k.val+km.val;
			}
			
			k.makeMoves(pl);
			
			if(k.teArray.length==0) { //負け
				if(pl==SELF) {
					return 100000;
				}
				else {
					return -100000;
				}
			}
			
			var retval:int=0;
			if(pl==SELF) {
				retval=100000;
			}
			else {
				retval-=100000;
			}
			
			for(var i:uint=0; i<k.teArray.length; i++) {
				var kk:Kyokumen=new Kyokumen(k.hashSeed, k.handHashSeed, 0, k.ban, k.Hand, k.controlE, k.controlS, k.val, 1);
				kk.moveForward(pl, k.teArray[i]);
				var v:int=AlphaBeta(pl==SELF?ENEMY:SELF,kk,alpha,beta,depth+1,depthMax);
				
				if((pl==SELF && v<retval) || (pl==ENEMY && v>retval)) {
					retval=v;
				//	bestTe[depth][depth]=k.teArray[i];
					if(pl==SELF) {
						beta=retval;
					}
					if(pl==ENEMY) {
						alpha=retval;
					}
					if((pl==SELF&&retval<=alpha) || (pl==ENEMY&&retval>=beta)) {
						return retval;
					}
				}
			}
			return retval;
			*/
		//}



		//public function MinMax(pl:uint, k:Kyokumen, depth:int, depthMax:int, count:int) {
			/*if(depth==depthMax) {
				return k.val;
			}

			k.makeMoves(pl);
			
			if(k.teArray.length==0) { //負け
				if(pl==SELF) {
					return 100000;
				}
				else {
					return -100000;
				}
			}
			
			var retval:int=0;
			if(pl==SELF) {
				retval=100000;
			}
			else {
				retval-=100000;
			}
//if(count==0) {
			for(var i:uint=0; i<k.teArray.length; i++) {//trace("そうかそうか"+k.teArray[i].from+","+k.teArray[i].to);
				var kk:Kyokumen=new Kyokumen(k.hashSeed, k.handHashSeed, 0, k.ban, k.Hand, k.controlE, k.controlS, k.val, 1);
				kk.moveForward(pl, k.teArray[i]);
				var v:int=MinMax(pl==SELF?ENEMY:SELF, kk, depth+1, depthMax, 4);
				if((pl==SELF && v<retval) || (pl==ENEMY && v>retval)) {
					retval=v;
					bestTe[depth][depth]=k.teArray[i];
				}
			}
//}
			return retval;*/
			
		//}

	}
}