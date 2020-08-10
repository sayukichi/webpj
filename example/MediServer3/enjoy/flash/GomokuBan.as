package {
	import flash.display.MovieClip;
	public class GomokuBan {
		
		var banpannding:Array=new Array();
		var ba:Array=new Array();
		
		public var vnum:int=14;
		public var hnum:int=14;
		public var SELF:int=1;
		public var ENEMY:int=2;
		public var NW:int=-vnum-1;
		public var N:int=-vnum;
		public var NE:int=-vnum+1;
		public var W:int=-1;
		public var E:int=1;
		public var SW:int=vnum-1;
		public var S:int=vnum;
		public var SE:int=vnum+1;
		
		
		function Ban() {
			
		}
		
	}
}