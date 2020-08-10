package {
	import flash.display.MovieClip;
	public class GomokuKyokumen extends GomokuBan {
		public var ban:Array=new Array();
		public var hantei:Array=new Array(); //そこに置けるかどうか
		public var ev:Array=new Array();
		public var lv:int=1;
		public var placed:uint=0; //石が何個置かれたか
		
		public var pdt:Array=new Array(); //pre double threat
		public var pdtcl:int=2;
		public var pdtclop:int=1;
		
		public var pdts:Array=new Array();
		public var pdtscl:int=1;
		public var pdtsclop:int=2;
		
		
		private var teNum:int=0;
		public var val:int=0; //局面の評価関数
		
		public var teArray:Array=new Array(); //打てる手を格納
		
		
		public function GomokuKyokumen(placed:int, banmen:Array, hanteiArray:Array, evArray:Array, level:int) {
			lv=level;
			placed=placed;
			for(i=0; i<vnum*hnum; i++) {
				ban[i]=banmen[i];
				hantei[i]=hanteiArray[i];
				ev[i]=evArray[i];
			}
			kyokumenFirst();
		}
			
			
		
		public function kyokumenFirst() {
			//for(i=0; i<144; i++) ban[i]=0;
			//for(i=0; i<144; i++) hantei[i]=0;
		}
		
		public function makeThreatHand(pl:uint):Array {
			var ret:Array=new Array();
			var pr:int=0;
			for(var k:uint=0; k<vnum*hnum; k++) {
				if(hantei[k]>0 && ban[k]==0) {
					ban[k]=pl;//手を打ってみる
					
					var v:int=Math.floor(k/hnum);
					var h:int=k%hnum;
					
					var dArray:Array=new Array();
					
					//下向きに探索
					var cl:Array=new Array();
					for(var i:int=0; i<vnum; i++) {
						cl.push(ban[i*hnum+h]);
					}
					cl.push(S+10);
					cl.push(h);
					dArray.push(cl);
					
					
					//右向きに探索
					cl=new Array();
					for(j=0; j<hnum; j++) {
						cl.push(ban[v*hnum+j]);
					}
					cl.push(E+10);
					cl.push(v*hnum);
					dArray.push(cl);
					
					//右下向きに探索
					if(h>=v && (h-v)<=(hnum-5)) {
						cl=new Array();
						for(i=0; i<hnum-(h-v); i++) {
							cl.push(ban[i*hnum+(i+(h-v))]);
						}
						cl.push(SE+10);
						cl.push(h-v);
						dArray.push(cl);
					}
					if(h<v && (v-h)<(vnum-4)) {
						cl=new Array();
						for(j=0; j<hnum-(v-h); j++) {
							cl.push(ban[((v-h)+j)*hnum+j]);
						}
						cl.push(SE+10);
						cl.push((v-h)*hnum);
						dArray.push(cl);
					}
					//左下向きに探索
					if(h+v>3 && hnum-1-h>=v) {
						cl=new Array();
						for(i=0; i<h+v+1; i++) {
							cl.push(ban[i*hnum+(h+v-i)]);
						}
						cl.push(SW+10);
						cl.push(h+v);
						dArray.push(cl);
					}
					if(hnum-1-h<v && (v-(hnum-1-h))<vnum-4) {
						cl=new Array();
						for(j=hnum-1; j>=(v-(hnum-1-h)); j--) {
							cl.push(ban[hnum*((hnum-1-j)+(v-(hnum-1-h)))+j]);
						}
						cl.push(SW+10);
						cl.push((v-(hnum-1-h))*hnum+13);
						dArray.push(cl);
					}
					
					var ar:Array=new Array();
					var count:int=0;
					for(i=0; i<dArray.length; i++) {
						ar.push(detect(dArray[i], pl));
						
					}
					var flag:Boolean=false;
					for(i=0; i<ar.length; i++) {
						if(ar[i].length>0) {
							flag=true;
						}
					}
					if(flag==true) {
						ret[pr]=new Array();
						ret[pr][0]=new Array();
						ret[pr][1]=new Array();
						ret[pr][0]=k;
						
						for(i=0; i<ar.length; i++) {
							if(ar[i].length>0) {
								ret[pr][1].push(ar[i][0]);
							}
						}
						pr++;
					}
					
					ban[k]=0;//打った手を解除
					
				}
			}
			return(ret);
		}
		
		
		
		public function countMove(pl:uint, pos:uint):int {
			var ret:Number=0;
			
			return(ret);
		}
		
		public function makeCand() {
			for(var i:int=vs; i<=ve; i++) {
				for(var j:int=hs; j<=he; j++) {
					if(ban[i*hnum+j]==0) hantei[i*hnum+j]=1;
				}
			}
			
		}
		
		public function threat_investigate(pl:uint):Array {
			var threats:Array=new Array();
			var dArray:Array=new Array();
			//下向きに探索
			for(var j:int=0; j<hnum; j++) {
				var cl:Array=new Array();
				for(var i:int=0; i<vnum; i++) {
					cl.push(ban[i*hnum+j]);
				}
				cl.push(S+10);
				cl.push(j);
				dArray.push(cl);
			}
			//右向きに探索
			for(i=0; i<vnum; i++) {
				cl=new Array();
				for(j=0; j<hnum; j++) {
					cl.push(ban[i*hnum+j]);
				}
				cl.push(E+10);
				cl.push(i*hnum);
				dArray.push(cl);
			}
			//右下向きに探索
			for(j=hnum-5; j>=0; j--) {
				cl=new Array();
				for(i=0; i<hnum-j; i++) {
					cl.push(ban[i*hnum+(i+j)]);
				}
				cl.push(SE+10);
				cl.push(j);
				dArray.push(cl);
			}
			for(i=1; i<vnum-4; i++) {
				cl=new Array();
				for(j=0; j<hnum-i; j++) {
					cl.push(ban[(i+j)*hnum+j]);
				}
				cl.push(SE+10);
				cl.push(i*hnum);
				dArray.push(cl);
			}
			//左下向きに探索
			for(j=4; j<hnum; j++) {
				cl=new Array();
				for(i=0; i<j+1; i++) {
					cl.push(ban[i*hnum+(j-i)]);
				}
				cl.push(SW+10);
				cl.push(j);
				dArray.push(cl);
			}
			for(i=1; i<vnum-4; i++) {
				cl=new Array();
				for(j=hnum-1; j>=i; j--) {
					cl.push(ban[(i+(hnum-1-j))*hnum+j]);
				}
				cl.push(SW+10);
				cl.push(i*hnum+13);
				dArray.push(cl);
			}
			
			for(i=0; i<dArray.length; i++) {
				var ret:Array=detect(dArray[i], pl);
				if(ret.length>0) threats.push(ret);
			}
			return(threats);
		}
		
		public function endCheck(pl:int):Boolean {
			var ar:Array=threat_investigate(pl);
			var ret:Boolean=false;
			if(ar.length>0) {
				for(var i:int=0; i<ar.length; i++) {
					for(var j:int=0; j<ar[i].length; j++) {
						if(ar[i][j][0]==0) {
							ret=true;
						}
					}
				}
			}
			return(ret);
		}
		
						   
		public function detect(array:Array, pl:uint):Array {
			var ret:Array=new Array();
			var pr:int=0;
			var cl:int=array[0];
			var count:int=0;
			var det:Array=new Array();
			var st:int=array[array.length-1];
			var dir:int=array[array.length-2]-10;
			for(var i:int=0; i<array.length-2; i++) {
				var pos:int=st+dir*i;
				cl=array[i];
				if(cl!=0 && cl==pl) {
					var op=0;
					if(pl==SELF) op=ENEMY;
					else op=SELF;
					count=1;
					while(array[i+count]==cl) {
						count++;
					}
					if(count>1) {
						if(count==5) {
							ret[pr]=new Array();
							ret[pr].push(0);
							//trace("5つ");
							
							pr++;
						}
						else if(count==4) {
							//trace("4つ");
							if(i>0 && array[i-1]==0 && array[i+count]==0) { //straight four/4つ揃って両方空き
								//trace("4つ重なって両方あき");
								
								ret[pr]=new Array();
								ret[pr].push(1);
								
								ret[pr].push(st+dir*(i-1));
								ret[pr].push(st+dir*(i+count));
								
								pr++;
							}
							if(i==0 && array[i+count]==0 || array[i-1]==0 && (i+count)==(array.length-2) || array[i-1]==0 && array[i+count]==op || array[i-1]==op && array[i+count]==0) { //four/4つ揃って一方空き
								//trace("4つ重なって一方空き, four"+pl);
								if(array[i+count]==0) {//trace("4つ重なって一方空き, fourq"+pl);
									ret[pr]=new Array();
									ret[pr].push(2);
									
									ret[pr].push(st+dir*(i+count));
									pr++;
								}
								else if(array[i-1]==0) {//trace("4つ重なって一方空き, fourc"+pl);
									ret[pr]=new Array();
									ret[pr].push(2);
								
									ret[pr].push(st+dir*(i-1));
									pr++;
								}
							}
						}
						else if(count==3) {
							if((i>2 && array[i-1]==0 && array[i-2]==cl) || ((i+count+2)<(array.length-2) && array[i+count]==0 && array[i+count+1]==cl)) {
								//trace("four,brokenfour");
								if(array[i-1]==0 && array[i-2]==cl) {
									ret[pr]=new Array();
									ret[pr].push(2);
								
									ret[pr].push(st+dir*(i-1));
									
									pr++;
								}
								else if(array[i+count]==0) {
									ret[pr]=new Array();
									ret[pr].push(2);
									ret[pr].push(st+dir*(i+count));
									
									pr++;
									
								}
							}
							if((i>0 && i+count<array.length-3 && array[i-1]==0 && array[i+count]==0 && array[i+count+1]==0) || (i>1 && i+count<array.length-2 && array[i-2]==0 && array[i-1]==0 && array[i+count]==0)) { //three/6つの空きスペースの真ん中に3つ揃う
								//trace("threever1");
								if(array[i+count+1]==0) {
									ret[pr]=new Array();
									ret[pr].push(3);
								
									ret[pr].push(st+dir*(i-1));
									ret[pr].push(st+dir*(i+count));
									//ret[pr].push(st+dir*(i+count+1));
									
									pr++;
								}
								else if(array[i-2]==0) {
									ret[pr]=new Array();
									ret[pr].push(3);
								
									//ret[pr].push(st+dir*(i-2));
									ret[pr].push(st+dir*(i-1));
									ret[pr].push(st+dir*(i+count));
									
									pr++;
								}
							}
						}
						else if(count==2) {
							if((i>0 && array[i-1]==0 && array[i+count]==0 && array[i+count+1]==cl & array[i+count+2]==0) || (i>2 && i+count<array.length-2 && array[i+count]==0 && array[i-1]==0 && array[i-2]==cl && array[i-3]==0)) { //broken three
								//trace("broken three");
								if(array[i-1]==0 && array[i+count+1]==cl && array[i+count]==0 && array[i+count+2]==0) {
									ret[pr]=new Array();
									ret[pr].push(3);
									ret[pr].push(st+dir*(i-1));
									ret[pr].push(st+dir*(i+count));
									ret[pr].push(st+dir*(i+count+2));
									pr++;
								}
								else if(array[i-3]==0) {
									ret[pr]=new Array();
									ret[pr].push(3);
									ret[pr].push(st+dir*(i+count));
									ret[pr].push(st+dir*(i-1));
									ret[pr].push(st+dir*(i-3));
									
									pr++;
								}
							}
							if((i>2 && array[i-1]==0 && array[i-2]==cl && array[i-3]==cl) || ((i+count+2)<(array.length-2) && array[i+count]==0 && array[i+count+1]==cl && array[i+count+2]==cl)) {
								
								 if(array[i+count]==0 && array[i+count+1]==cl) {
									ret[pr]=new Array();
									ret[pr].push(2);
									ret[pr].push(st+dir*(i+count));
									i+=2;
									pr++;
								}
							}
						}
						i+=count;
					}
				}
			}
			return(ret);
		}
		
		public function mf(pl:uint, k:int) {
			placed++;
			ban[k]=pl;
			if(ban[k]>0) {
				var vn=Math.floor(k/vnum);
				var hn=k%hnum;
				var vs=Math.max(vn-2, 0);
				var ve=Math.min(vn+2, vnum-1);
				var hs=Math.max(hn-2, 0);
				var he=Math.min(hn+2, hnum-1);
				for(var i:int=vs; i<=ve; i++) { //COMが置く場所の候補
					for(var j:int=hs; j<=he; j++) {
						if(ban[i*hnum+j]==0) hantei[i*hnum+j]=1;
					}
				}
			}
		}
		
		public function mb(pl:uint, k:int) {
			ban[k]=0;
			placed--;
		}
		
		public function find_sequence(pl:uint) {
			var cand:Array=new Array();
			for(var i:int=0; i<vnum*hnum; i++) if(hantei[i]==1) cand.push(i);
			for(i=0; i<cand.length; i++) {
				this.mf(ENEMY, cand[i]);
				var ar:Array=threat_investigate(ENEMY);
				for(i=0; i<ar.length; i++) {
					if(ar[i][1].length>1) {
						//trace("COMのダブルの可能性");
					}
				}
				this.mb(ENEMY, cand[i]);
			}
		}
		
		private function moveTo(pl:uint, to:uint) {
			var p:uint=0;
			var koma:uint=0;
			
		}
		
		public function moveForward(pl:uint, place:int) { //ひとつすすめる
			placed++;
			ban[place]=pl;
			
			for(var k:int=0; k<hnum*vnum; k++) {
				hantei[k]=0;
			}
			for(k=0; k<hnum*vnum; k++) {
				if(ban[k]>0) {
					var vn=Math.floor(k/vnum);
					var hn=k%hnum;
					var vs=Math.max(vn-2, 0);
					var ve=Math.min(vn+2, vnum-1);
					var hs=Math.max(hn-2, 0);
					var he=Math.min(hn+2, hnum-1);
					for(var i:int=vs; i<=ve; i++) { //COMが置く場所の候補
						for(var j:int=hs; j<=he; j++) {
							if(ban[i*hnum+j]==0) hantei[i*hnum+j]=1;
						}
					}
				}
			}
			
			eval_replenish(place);
		}
		
		public function moveBack(pl:uint, place:int) { //ひとつ戻す
			placed--;
			ban[place]=0;
		
			for(var k:int=0; k<hnum*vnum; k++) {
				hantei[k]=0;
			}
			for(k=0; k<hnum*vnum; k++) {
				if(ban[k]>0) {
					var vn=Math.floor(k/vnum);
					var hn=k%hnum;
					var vs=Math.max(vn-2, 0);
					var ve=Math.min(vn+2, vnum-1);
					var hs=Math.max(hn-2, 0);
					var he=Math.min(hn+2, hnum-1);
					for(var i:int=vs; i<=ve; i++) { //COMが置く場所の候補
						for(var j:int=hs; j<=he; j++) {
							if(ban[i*hnum+j]==0) hantei[i*hnum+j]=1;
						}
					}
				}
			}
		
		
			eval_replenish(place);
		}
		
		
		
		public function eval_replenish(place:uint) {
			var threats:Array=new Array();
			var dArray:Array=new Array();
			
			for(var k:int=0; k<vnum*hnum; k++) ev[k]=0;
			//下向きに探索
			for(var j:int=0; j<hnum; j++) {
				var cl:Array=new Array();
				for(var i:int=0; i<vnum; i++) {
					cl.push(ban[i*hnum+j]);
				}
				cl.push(S+10);
				cl.push(j);
				dArray.push(cl);
			}
			//右向きに探索
			for(i=0; i<vnum; i++) {
				cl=new Array();
				for(j=0; j<hnum; j++) {
					cl.push(ban[i*hnum+j]);
				}
				cl.push(E+10);
				cl.push(i*hnum);
				dArray.push(cl);
			}
			//右下向きに探索
			for(j=hnum-5; j>=0; j--) {
				cl=new Array();
				for(i=0; i<hnum-j; i++) {
					cl.push(ban[i*hnum+(i+j)]);
				}
				cl.push(SE+10);
				cl.push(j);
				dArray.push(cl);
			}
			for(i=1; i<vnum-4; i++) {
				cl=new Array();
				for(j=0; j<hnum-i; j++) {
					cl.push(ban[(i+j)*hnum+j]);
				}
				cl.push(SE+10);
				cl.push(i*hnum);
				dArray.push(cl);
			}
			//左下向きに探索
			for(j=4; j<hnum; j++) {
				cl=new Array();
				for(i=0; i<j+1; i++) {
					cl.push(ban[i*hnum+(j-i)]);
				}
				cl.push(SW+10);
				cl.push(j);
				dArray.push(cl);
			}
			for(i=1; i<vnum-4; i++) {
				cl=new Array();
				for(j=hnum-1; j>=i; j--) {
					cl.push(ban[(i+(hnum-1-j))*hnum+j]);
				}
				cl.push(SW+10);
				cl.push(i*hnum+13);
				dArray.push(cl);
			}
			
			for(i=0; i<hnum*vnum; i++) {
				pdt[i]=0;
				pdts[i]=0;
			}
			
			val=0;
			for(i=0; i<dArray.length; i++) {
				eval(dArray[i]);
			}
			
			for(i=0; i<hnum*vnum; i++) {
				if(pdt[i]>1) {
					if(lv==2) val+=50;
					//trace("predoublethreat!");
				}
				else if(pdts[i]>1) {
					//if(lv==2) val-=70;
				}
			}
		}
		
		public function eval(array:Array):Array { //各マス目の重要度をチェック
			var ret:Array=new Array();
			var pr:int=0;
			var cl:int=array[0];
			var count:int=0;
			var det:Array=new Array();
			var st:int=array[array.length-1];
			var dir:int=array[array.length-2]-10;
			for(var i:int=0; i<array.length-2; i++) {
				var pos:int=st+dir*i;
				if(ban[pos]!=0) ev[pos]=0;
			}
			for(i=0; i<array.length-2; i++) {
				pos=st+dir*i;
				cl=array[i];
				if(cl!=0) {
					var op=0;
					if(cl==SELF) op=ENEMY;
					else op=SELF;
					count=1;
					while(array[i+count]==cl) {
						count++;
					}
					if(count>0) {
						if(count==3) {
							if(cl==ENEMY) val+=30;
							//pdtcheck
							if(cl==pdtcl && array[i-1]==0 && array[i-2]==0 && array[i+count]==pdtclop) {
								pdt[st+dir*(i-2)]++;
								pdt[st+dir*(i-1)]++;
							}
							if(cl==pdtcl && array[i-1]==pdtclop && array[i+count]==0 && array[i+count+1]==0) {
								pdt[st+dir*(i+count)]++;
								pdt[st+dir*(i+count+1)]++;
							}
							if(cl==pdtscl && array[i-1]==0 && array[i-2]==0 && array[i+count]==pdtsclop) {
								pdts[st+dir*(i-2)]++;
								pdts[st+dir*(i-1)]++;
							}
							if(cl==pdtscl && array[i-1]==pdtsclop && array[i+count]==0 && array[i+count+1]==0) {
								pdts[st+dir*(i+count)]++;
								pdts[st+dir*(i+count+1)]++;
							}
							
							if(array[i+count]==0) {
								if(cl==SELF) {
									ev[st+dir*(i+count)]+=3;
									//val+=40;
								}
								else if(cl==ENEMY) {
									ev[st+dir*(i+count)]+=5;
								}
							}
							if(array[i+count+1]==0) {
								if(cl==SELF) {
							//ev[st+dir*(i+count+1)]+=50;
									//val+=5;
								}
								else if(cl==ENEMY) {
									//val+=10;
									//ev[st+dir*(i+count+1)]+=10;
								}
							}
							if(array[i-1]==0) {
								if(cl==SELF) {
									ev[st+dir*(i-1)]+=3;
									//val-=40;
								}
								else if(cl==ENEMY) {
									ev[st+dir*(i-1)]+=5;
									//val+=30;
								}
							}
							if(array[i-2]==0) {
								if(cl==SELF) {
									//ev[st+dir*(i-2)]+=50;
									//val-=5;
								}
								else if(cl==ENEMY) {
									//ev[st+dir*(i-2)]+=10;
									//val+=10;
								}
							}
						}
						if(count==2) {
							
							if(cl==ENEMY) val+=15
							//pdtcheck
							if(cl==pdtcl && array[i-1]==0 && array[i-2]==0 && array[i-3]==pdtcl) {
								pdt[st+dir*(i-2)]++;
								pdt[st+dir*(i-1)]++;
							}
							if(cl==pdtcl && array[i+count+2]==pdtcl && array[i+count]==0 && array[i+count+1]==0) {
								pdt[st+dir*(i+count)]++;
								pdt[st+dir*(i+count+1)]++;
							}
							if(cl==pdtscl && array[i-1]==0 && array[i-2]==0 && array[i-3]==pdtscl) {
								pdts[st+dir*(i-2)]++;
								pdts[st+dir*(i-1)]++;
							}
							if(cl==pdtscl && array[i+count+2]==pdtscl && array[i+count]==0 && array[i+count+1]==0) {
								pdts[st+dir*(i+count)]++;
								pdts[st+dir*(i+count+1)]++;
							}
							//pdtcheck
							if(cl==pdtcl && array[i-1]==0 && array[i-2]==pdtcl && array[i-3]==0) {
								pdt[st+dir*(i-3)]++;
								pdt[st+dir*(i-1)]++;
							}
							if(cl==pdtcl && array[i+count+2]==0 && array[i+count]==0 && array[i+count+1]==pdtcl) {
								pdt[st+dir*(i+count)]++;
								pdt[st+dir*(i+count+2)]++;
							}
							if(cl==pdtscl && array[i-1]==0 && array[i-2]==pdtscl && array[i-3]==0) {
								pdts[st+dir*(i-3)]++;
								pdts[st+dir*(i-1)]++;
							}
							if(cl==pdtscl && array[i+count+2]==0 && array[i+count]==0 && array[i+count+1]==pdtscl) {
								pdts[st+dir*(i+count)]++;
								pdts[st+dir*(i+count+2)]++;
							}
							
							
							
							if(array[i+count]==0 && array[i-1]==0 && (array[i+count+1]==0 || array[i-2]==0)) {
								if(cl==SELF) {
									ev[st+dir*(i-1)]+=3;
									ev[st+dir*(i+count)]+=3;
									//val-=6;
								}
								else if(cl==ENEMY) {
									ev[st+dir*(i-1)]+=2;
									ev[st+dir*(i+count)]+=2;
									//if(array[i+count+1]==0) ev[st+dir*(i+count+1)]+=4;
									//if(array[i-2]==0) ev[st+dir*(i-2)]+=4;
									//val+=4;
								}
							}
							
							
							/*if(array[i+count]==0) {
								if(cl==SELF) {
									ev[st+dir*(i+count)]+=10;
									val-=8;
								}
								else if(cl==ENEMY) {
									//ev[st+dir*(i+count)]+=15;
									//val+=5;
								}
							}
							if(array[i+count+1]==0) {
								if(cl==SELF) {
									val-=2;
									ev[st+dir*(i+count+1)]+=2;
								}
								else if(cl==ENEMY) {
									//val+=1;
									//ev[st+dir*(i+count+1)]+=5;
								}
							}
							if(array[i-1]==0) {
								if(cl==SELF) {
									ev[st+dir*(i-1)]+=10;
									val-=8;
								}
								else if(cl==ENEMY) {
									//ev[st+dir*(i-1)]+=15;
									//val+=5;
								}
							}
							if(array[i-2]==0) {
								if(cl==SELF) {
									ev[st+dir*(i-2)]+=2;
									val-=2;
								}
								else if(cl==ENEMY) {
									//ev[st+dir*(i-2)]+=5;
									//val+=1;
								}
								
							}*/
						}
						if(count==1) {
							//pdtcheck
							if(cl==pdtcl && array[i+count]==0 && array[i+count+1]==0 && array[i+count+2]==pdtcl && array[i-1]==0 && array[i+count+3]==0) {
								pdt[st+dir*(i+count)]++;
								pdt[st+dir*(i+count+1)]++;
							}
							if(cl==pdtscl && array[i+count]==0 && array[i+count+1]==0 && array[i+count+2]==pdtscl && array[i-1]==0 && array[i+count+3]==0) {
								pdts[st+dir*(i+count)]++;
								pdts[st+dir*(i+count+1)]++;
							}
							
							//pre threat check
							if(array[i+count]==0 && array[i+count+1]==0 && array[i+count+2]==cl && array[i-1]==0 && array[i+count+3]==0) {
								
								
								
								if(cl==SELF) {
									val-=4;
									ev[st+dir*(i+count)]+=2;
									ev[st+dir*(i+count+1)]+=2;
								}
								else if(cl==ENEMY) {
									//val+=2;
									//ev[st+dir*(i+count)]+=2;
									//ev[st+dir*(i+count+1)]+=2;
								}
								
							}
							
							
							//pdtcheck
								if(cl==pdtcl && i>0 && array[i-1]==0 && array[i+count]==0 && array[i+count+1]==pdtcl && array[i+count+2]==0 && array[i+count+3]==0) {
									pdt[st+dir*(i+count)]++;
									pdt[st+dir*(i+count+2)]++;
								}
								if(cl==pdtcl && array[i-2]==0 && array[i-1]==0 && array[i+count]==0 && array[i+count+1]==pdtcl && array[i+count+2]==0) {
									pdt[st+dir*(i-1)]++;
									pdt[st+dir*(i+count+1)]++;
								}
								if(cl==pdtscl && i>0 && array[i-1]==0 && array[i+count]==0 && array[i+count+1]==pdtscl && array[i+count+2]==0 && array[i+count+3]==0) {
									pdts[st+dir*(i+count)]++;
									pdts[st+dir*(i+count+2)]++;
								}
								if(cl==pdtscl && array[i-2]==0 && array[i-1]==0 && array[i+count]==0 && array[i+count+1]==pdtscl && array[i+count+2]==0) {
									pdts[st+dir*(i-1)]++;
									pdts[st+dir*(i+count+1)]++;
								}
							
							
							
							if(i>0 && array[i-1]==0 && array[i+count]==0 && array[i+count+1]==cl && array[i+count+2]==0 && array[i+count+3]==0 || i>1 && array[i-2]==0 && array[i-1]==0 && array[i+count]==0 && array[i+count+1]==cl && array[i+count+2]==0) {
								
								
								if(cl==SELF) {
									val-=1;
									ev[st+dir*(i+count)]+=1;
								}
								else if(cl==ENEMY) {
									//val+=8;
									//ev[st+dir*(i+count)]+=2;
								}
								
							}
							
							if(array[i+count]==0 && array[i-1]==0 && array[i+count+1]==0 && array[i-2]==0) {
								if(cl==SELF) {
									ev[st+dir*(i-1)]+=1;
									ev[st+dir*(i+count)]+=1;
									//val-=2;
									if(array[i+count]==0 && array[i-1]==0) val-=1;
								}
								else if(cl==ENEMY) {
									ev[st+dir*(i-1)]+=1;
									//ev[st+dir*(i+count)]+=2;
								}
							}
							
							if(array[i+count]==0) {
								if(cl==SELF) {
									ev[st+dir*(i+count)]+=1;
									val-=1;
								}
								else if(cl==ENEMY) {
									//ev[st+dir*(i+count)]+=2;
									
								}
							}
							if(array[i+count+1]==0) {
								if(cl==SELF) {
									//ev[st+dir*(i+count+1)]+=1;
								}
								else if(cl==ENEMY) {
									//ev[st+dir*(i+count+1)]+=0;
								}
							}
							if(array[i-1]==0) {
								if(cl==SELF) {
									val-=1;
									ev[st+dir*(i-1)]+=1;
								}
								else if(cl==ENEMY) {
									//ev[st+dir*(i-1)]+=2;
								}
							}
							if(array[i-2]==0) {
								if(cl==SELF) {
									//ev[st+dir*(i-2)]+=1;
								}
								else if(cl==ENEMY) {
									//ev[st+dir*(i-2)]+=0;
								}
								
							}
						}
						i+=count;
					}
				}
			}
			return(ret);
		}
		
		
		
		public function makeMoves(pl:uint) {
			teArray=new Array();
			teNum=0;
			
			for(var i:int=0; i<vnum*hnum; i++) {
				if(ban[i]==0) {
					//if(ban[i-
					   
				}
			}
			
			
		}
		
		
		public function search(pos:uint, dir:int):uint {
			pos+=dir;
			while(ban[pos]==0) {
				pos+=dir;
			}
			return(pos);
		}
		
	}
	
}