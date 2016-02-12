var MersenneTwister;
MersenneTwister=(function()
{
	a.prototype.N=624;
	a.prototype.M=397;
	a.prototype.MATRIX_A=2567483615;
	a.prototype.UPPER_MASK=2147483648;
	a.prototype.LOWER_MASK=2147483647;
	function a(b)
	{
		this.mt=new Array(this.N);
		this.setSeed(b)
	}
	a.prototype.unsigned32=function(b)
	{
		if(b<0)
		{
			return(b^this.UPPER_MASK)+this.UPPER_MASK
		}
		else
		{
			return b
		}
	};
	a.prototype.subtraction32=function(c,b)
	{
		if(c<b)
		{
			return this.unsigned32((4294967296-(b-c))%4294967295)
		}
		else
		{
			return c-b
		}
	};
	a.prototype.addition32=function(c,b)
	{
		return this.unsigned32((c+b)&4294967295)
	};
	a.prototype.multiplication32=function(e,c)
	{
		var b,d;d=0;
		for(b=0;b<32;b++)
		{
			if((e>>>b)&1)
			{
				d=this.addition32(d,this.unsigned32(c<<b))
			}
		}
		return d
	};
	a.prototype.setSeed=function(b)
	{
		if(!b||typeof b==="number")
		{
			return this.seedWithInteger(b)
		}
		else
		{
			return this.seedWithArray(b)
		}
	};
	a.prototype.defaultSeed=function()
	{
		var b;
		b=new Date();
		return b.getMinutes()*60000+b.getSeconds()*1000+b.getMilliseconds()
	};
	a.prototype.seedWithInteger=function(c)
	{
		var b;
		this.seed=c!=null?c:this.defaultSeed();
		this.mt[0]=this.unsigned32(this.seed&4294967295);
		this.mti=1;
		b=[];
		while(this.mti<this.N)
		{
			this.mt[this.mti]=this.addition32(this.multiplication32(1812433253,this.unsigned32(this.mt[this.mti-1]^(this.mt[this.mti-1]>>>30))),this.mti);
			this.mti[this.mti]=this.unsigned32(this.mt[this.mti]&4294967295);
			b.push(this.mti++)
		}
		return b
	};
	a.prototype.seedWithArray=function(f){var e,d,b,c;this.seedWithInteger(19650218);
	e=1;
	d=0;
	b=this.N>f.length?this.N:f.length;
	while(b>0)
	{
		c=this.multiplication32(this.unsigned32(this.mt[e-1]^(this.mt[e-1]>>>30)),1664525);
		this.mt[e]=this.addition32(this.addition32(this.unsigned32(this.mt[e]^c),f[d]),d);
		this.mt[e]=this.unsigned32(this.mt[e]&4294967295);
		e++;
		d++;
		if(e>=this.N)
		{
			this.mt[0]=this.mt[this.N-1];
			e=1
		}
		if(d>=f.length)
		{
			d=0
		}
		b--
	}
	b=this.N-1;
	while(b>0)
	{
		this.mt[e]=this.subtraction32(this.unsigned32(this.mt[e]^this.multiplication32(this.unsigned32(this.mt[e-1]^(this.mt[e-1]>>>30)),1566083941)),e);
		this.mt[e]=this.unsigned32(this.mt[e]&4294967295);
		e++;
		if(e>=this.N)
		{
			this.mt[0]=this.mt[this.N-1];e=1
		}
	}
	return this.mt[0]=2147483648};
	a.prototype.nextInteger=function(b)
	{
		var c,d,e;
		if((b!=null?b:1)<1)
		{
			return 0
		}
		d=[0,this.MATRIX_A];
		if(this.mti>=this.N)
		{
			c=0;
			while(c<this.N-this.M)
			{
				e=this.unsigned32((this.mt[c]&this.UPPER_MASK)|(this.mt[c+1]&this.LOWER_MASK));
				this.mt[c]=this.unsigned32(this.mt[c+this.M]^(e>>>1)^d[e&1]);
				c++
			}
			while(c<this.N-1)
			{
				e=this.unsigned32((this.mt[c]&this.UPPER_MASK)|(this.mt[c+1]&this.LOWER_MASK));
				this.mt[c]=this.unsigned32(this.mt[c+this.M-this.N]^(e>>>1)^d[e&1]);
				c++
			}
			e=this.unsigned32((this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK));
			this.mt[this.N-1]=this.unsigned32(this.mt[this.M-1]^(e>>>1)^d[e&1]);
			this.mti=0
		}
		e=this.mt[this.mti++];
		e=this.unsigned32(e^(e>>>11));
		e=this.unsigned32(e^((e<<7)&2636928640));
		e=this.unsigned32(e^((e<<15)&4022730752));
		return this.unsigned32(e^(e>>>18))%(b!=null?b:4294967296)
	};
	a.prototype.nextFloat=function()
	{
		return this.nextInteger()/4294967295
	};
	a.prototype.nextBoolean=function()
	{
		return this.nextInteger()%2===0
	};
	return a
})();


var Maze;
Maze=(function()
{
	function a(e,b,c,d)
	{
		this.width=e;
		this.height=b;
		d!=null?d:d={};
		this.grid=new a.Grid(this.width,this.height);
		this.rand=d.rng||new MersenneTwister(d.seed);
		this.isWeave=d.weave;
		if(this.rand.randomElement==null)
		{
			this.rand.randomElement=function(f)
			{
				return f[this.nextInteger(f.length)]
			};
			this.rand.removeRandomElement=function(g)
			{
				var f;
				f=g.splice(this.nextInteger(g.length),1);
				if(f)
				{
					return f[0]
				}
			};
			this.rand.randomizeList=function(k)
			{
				var g,f,h;
				g=k.length-1;
				while(g>0)
				{
					f=this.nextInteger(g+1);
					h=[k[f],k[g]],k[g]=h[0],k[f]=h[1];
					g--
				}
				return k
			};
			this.rand.randomDirections=function()
			{
				return this.randomizeList(a.Direction.List.slice(0))
			}
		}
		this.algorithm=new c(this,d)
	}
	a.prototype.onUpdate=function(b)
	{
		return this.algorithm.onUpdate(b)
	};
	a.prototype.onEvent=function(b)
	{
		return this.algorithm.onEvent(b)
	};
	a.prototype.generate=function()
	{
		var b;
		b=[];
		while(true)
		{
			if(!this.step())
			{
				break
			}
		}
		return b
	};
	a.prototype.step=function()
	{
		return this.algorithm.step()
	};
	a.prototype.isEast=function(b,c)
	{
		return this.grid.isMarked(b,c,a.Direction.E)
	};
	a.prototype.isWest=function(b,c)
	{
		return this.grid.isMarked(b,c,a.Direction.W)
	};
	a.prototype.isNorth=function(b,c)
	{
		return this.grid.isMarked(b,c,a.Direction.N)
	};
	a.prototype.isSouth=function(b,c)
	{
		return this.grid.isMarked(b,c,a.Direction.S)
	};
	a.prototype.isUnder=function(b,c)
	{
		return this.grid.isMarked(b,c,a.Direction.U)
	};
	a.prototype.isValid=function(b,c)
	{
		return(0<=b&&b<this.width)&&(0<=c&&c<this.height)
	};
	a.prototype.carve=function(b,d,c)
	{
		return this.grid.mark(b,d,c)
	};
	a.prototype.uncarve=function(b,d,c)
	{
		return this.grid.clear(b,d,c)
	};
	a.prototype.isSet=function(b,d,c)
	{
		return this.grid.isMarked(b,d,c)
	};
	a.prototype.isBlank=function(b,c)
	{
		return this.grid.at(b,c)===0
	};
	a.prototype.isPerpendicular=function(b,d,c)
	{
		return(this.grid.at(b,d)&a.Direction.Mask)===a.Direction.cross[c]
	};
	return a
})();
	
Maze.Algorithms={};
Maze.Algorithm=(function()
{
	function a(c,b)
	{
		this.maze=c;
		b!=null?b:b={};
		this.updateCallback=function(f,d,e){};
		this.eventCallback=function(f,d,e){};
		this.rand=this.maze.rand
	}
	a.prototype.onUpdate=function(b)
	{
		return this.updateCallback=b
	};
	a.prototype.onEvent=function(b)
	{
		return this.eventCallback=b
	};
	a.prototype.updateAt=function(b,c)
	{
		return this.updateCallback(this.maze,b,c)
	};
	a.prototype.eventAt=function(b,c)
	{
		return this.eventCallback(this.maze,b,c)
	};
	a.prototype.canWeave=function(c,e,d)
	{
		var b,f;
		if(this.maze.isWeave&&this.maze.isPerpendicular(e,d,c))
		{
			b=e+Maze.Direction.dx[c];
			f=d+Maze.Direction.dy[c];
			return this.maze.isValid(b,f)&&this.maze.isBlank(b,f)
		}
	};
	a.prototype.performThruWeave=function(c,b)
	{
		if(this.rand.nextBoolean())
		{
			return this.maze.carve(c,b,Maze.Direction.U)
		}
		else
		{
			if(this.maze.isNorth(c,b))
			{
				this.maze.uncarve(c,b,Maze.Direction.N|Maze.Direction.S);
				return this.maze.carve(c,b,Maze.Direction.E|Maze.Direction.W|Maze.Direction.U)
			}
			else
			{
				this.maze.uncarve(c,b,Maze.Direction.E|Maze.Direction.W);
				return this.maze.carve(c,b,Maze.Direction.N|Maze.Direction.S|Maze.Direction.U)
			}
		}
	};
	a.prototype.performWeave=function(b,i,f,h)
	{
		var d,c,g,e;d=i+Maze.Direction.dx[b];
		c=f+Maze.Direction.dy[b];
		g=d+Maze.Direction.dx[b];
		e=c+Maze.Direction.dy[b];
		this.maze.carve(i,f,b);
		this.maze.carve(g,e,Maze.Direction.opposite[b]);
		this.performThruWeave(d,c);
		if(h){h(g,e)}this.updateAt(i,f);
		this.updateAt(d,c);
		return this.updateAt(g,e)
	};
	return a
})();
			
Maze.Direction=
{
	N:1,S:2,E:4,W:8,U:16,
		Mask:1|2|4|8|16,
		List:[1,2,4,8],
		dx:{1:0,2:0,4:1,8:-1},
		dy:{1:-1,2:1,4:0,8:0},
		opposite:{1:2,2:1,4:8,8:4},
		cross:{1:4|8,2:4|8,4:1|2,8:1|2}
};

Maze.Grid=(function()
{
	function a(d,c)
	{
		var b,e;
		this.width=d;this.height=c;
		this.data=(function()
		{
			var g,f;
			f=[];
			for(e=1,g=this.height;(1<=g?e<=g:e>=g);(1<=g?e+=1:e-=1))
			{
				f.push((function()
				{
					var i,h;
					h=[];
					for(b=1,i=this.width;(1<=i?b<=i:b>=i);(1<=i?b+=1:b-=1))
					{
						h.push(0)
					}
					return h
				}).call(this))
			}
			return f
		}).call(this)
	}
	a.prototype.at=function(b,c)
	{
		return this.data[c][b]
	};
	a.prototype.mark=function(b,d,c)
	{
		return this.data[d][b]|=c
	};
	a.prototype.clear=function(b,d,c)
	{
		return this.data[d][b]&=~c
	};
	a.prototype.isMarked=function(b,d,c)
	{
		return(this.data[d][b]&c)===c
	};
	return a
})();
			
var __bind=function(a,b)
{
	return function()
	{
		return a.apply(b,arguments)
	}
};

Maze.createWidget=function(j,c,n,p)
{
	var l,g,o,k,h,b,m,d,a,i,f,e;
	p!=null?p:p={};
	a=function(t,q,s,r)
	{
		if(t.isEast(q,s))
		{
			r.push("e")
		}
		if(t.isWest(q,s))
		{
			r.push("w")
		}
		if(t.isSouth(q,s))
		{
			r.push("s")
		}
		if(t.isNorth(q,s))
		{
			r.push("n")
		}
		if(t.isUnder(q,s))
		{
			return r.push("u")
		}
	};
	l=
	{
		AldousBroder:function(t,q,s,r)
		{
			if(t.algorithm.isCurrent(q,s))
			{
				return r.push("cursor")
			}else
			{
				if(!t.isBlank(q,s))
				{
					r.push("in");
					return a(t,q,s,r)
				}
			}
		},
		GrowingTree:function(t,q,s,r)
		{
			if(!t.isBlank(q,s))
			{
				if(t.algorithm.inQueue(q,s))
				{
					r.push("f")
				}
				else
				{
					r.push("in")
				}
				return a(t,q,s,r)
			}
		},
		GrowingBinaryTree:function(t,q,s,r)
		{
			return l.GrowingTree(t,q,s,r)
		},
		HuntAndKill:function(t,q,s,r)
		{
			if(t.algorithm.isCurrent(q,s))
			{
				r.push("cursor")
			}
			if(!t.isBlank(q,s))
			{
				r.push("in");
				return a(t,q,s,r)
			}
		},
		Prim:function(t,q,s,r)
		{
			if(t.algorithm.isFrontier(q,s))
			{
				return r.push("f")
			}
			else
			{
				if(t.algorithm.isInside(q,s))
				{
					r.push("in");
					return a(t,q,s,r)
				}
			}
		},
		RecursiveBacktracker:function(t,q,s,r)
		{
			if(t.algorithm.isStack(q,s))
			{
				r.push("f")
			}
			else
			{
				r.push("in")
			}
			return a(t,q,s,r)
		},
		RecursiveDivision:function(t,q,s,r)
		{
			return a(t,q,s,r)
		},
		Wilson:function(t,q,s,r)
		{
			if(t.algorithm.isCurrent(q,s))
			{
				r.push("cursor");
				return a(t,q,s,r)
			}
			else
			{
				if(!t.isBlank(q,s))
				{
					r.push("in");return a(t,q,s,r)
				}
				else
				{
					if(t.algorithm.isVisited(q,s))
					{
						return r.push("f")
					}
				}
			}
		},
		Houston:function(t,q,s,r)
		{
			if(t.algorithm.worker.isVisited!=null)
			{
				return l.Wilson(t,q,s,r)
			}
			else
			{
				return l.AldousBroder(t,q,s,r)
			}
		},
		"default":function(t,q,s,r)
		{
			if(!t.isBlank(q,s))
			{
				r.push("in");
				return a(t,q,s,r)
			}
		}
	};
	d=function(u,r,t)
	{
		var q,s;
		s=[];
		(l[j]||l["default"])(u,r,t,s);
		q=document.getElementById(""+u.element.id+"_y"+t+"x"+r);
		return q.className=s.join(" ")
	};
	o=function(s,q,r)
	{
		if(s.element.quickStep)
		{
			return s.element.mazePause()
		}
	};
	b=p.id||j.toLowerCase();
	(f=p.interval)!=null?f:p.interval=50;m="maze";
	if(p["class"])
	{
		m+=" "+p["class"]
	}
	k="grid";
	if(p.wallwise)
	{
		k+=" invert"
	}
	if(p.padded)
	{
		k+=" padded"
	}
	if((e=p.watch)!=null?e:true)
	{
		i="<a id='"+b+"_watch' href='#' onclick='document.getElementById(\""+b+"\").mazeQuickStep(); return false;'>Watch</a>"
	}
	else
	{
		i=""
	}
	h='<div id="'+b+'" class="'+m+'">\n  <div id="'+b+'_grid" class="'
		+k+'"></div>\n  <div class="operations">\n    <a id="'
		+b+'_reset" href="#" onclick="document.getElementById(\''
		+b+'\').mazeReset(); return false;">Reset</a>\n    <a id="'
		+b+'_step" href="#" onclick="document.getElementById(\''
		+b+"').mazeStep(); return false;\">Step</a>\n    "
		+i+'\n    <a id="'+b+'_run" href="#" onclick="document.getElementById(\''
		+b+"').mazeRun(); return false;\">Run</a>\n  </div>\n</div>";
	document.write(h);
	g=document.getElementById(b);
	g.addClassName=function(t,r)
	{
		var s,v,u,q;
		v=t.className.split(" ");
		for(u=0,q=v.length;u<q;u++)
		{
			s=v[u];
			if(s===r)
			{
				return
			}
		}
		return t.className+=" "+r
	};
	g.removeClassName=function(u,s)
	{
		var t,w,v,r,q;
		if(u.className.length>0)
		{
			w=u.className.split(" ");
			u.className="";
			q=[];
			for(v=0,r=w.length;v<r;v++)
			{
				t=w[v];
				q.push(t!==s?(u.className.length>0?u.className+=" ":void 0,u.className+=t):void 0)
			}
			return q
		}
	};
	g.mazePause=function()
	{
		if(this.mazeStepInterval!=null)
		{
			clearInterval(this.mazeStepInterval);
			this.mazeStepInterval=null;
			this.quickStep=false;
			return true
		}
	};
	g.mazeRun=function()
	{
		if(!this.mazePause())
		{
			return this.mazeStepInterval=setInterval((__bind(function()
			{
				return this.mazeStep()
			},this)),p.interval)
		}
	};
	g.mazeStep=function()
	{
		var q;
		if(!this.maze.step())
		{
			this.mazePause();
			this.addClassName(document.getElementById(""+this.id+"_step"),"disabled");
			if((q=p.watch)!=null?q:true)
			{
				this.addClassName(document.getElementById(""+this.id+"_watch"),"disabled")
			}
			return this.addClassName(document.getElementById(""+this.id+"_run"),"disabled")
		}
	};
	g.mazeQuickStep=function()
	{
		this.quickStep=true;
		return this.mazeRun()
	};
	g.mazeReset=function()
	{
		var q,u,r,A,z,w,v,t,s;
		this.mazePause();
		if(typeof p.input==="function")
		{
			A=p.input()
		}
		else
		{
			A=p.input
		}
		this.maze=new Maze
		(
			c,n,Maze.Algorithms[j],
			{
				seed:p.seed,rng:p.rng,input:A,
					weave:p.weave,weaveMode:p.weaveMode,
					weaveDensity:p.weaveDensity
			}
		);
		this.maze.element=this;
		this.maze.onUpdate(d);
		this.maze.onEvent(o);
		q="";
		for(w=0,v=this.maze.height;(0<=v?w<v:w>v);(0<=v?w+=1:w-=1))
		{
			r=""+this.id+"_y"+w;q+="<div class='row' id='"+r+"'>";
			for(z=0,t=this.maze.width;(0<=t?z<t:z>t);(0<=t?z+=1:z-=1))
			{
				q+="<div id='"+r+"x"+z+"'>";
				if(p.padded)
				{
					q+="<div class='np'></div>";
					q+="<div class='wp'></div>";
					q+="<div class='ep'></div>";
					q+="<div class='sp'></div>";
					q+="<div class='c'></div>"
				}
				q+="</div>"
			}
			q+="</div>"
		}
		u=document.getElementById(""+this.id+"_grid");
		u.innerHTML=q;
		this.removeClassName(document.getElementById(""+this.id+"_step"),"disabled");
		if((s=p.watch)!=null?s:true)
		{
			this.removeClassName(document.getElementById(""+this.id+"_watch"),"disabled")
		}
		return this.removeClassName(document.getElementById(""+this.id+"_run"),"disabled")
	};
	return g.mazeReset()
};
				
var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b)
	{
		if(__hasProp.call(b,a))
		{
			d[a]=b[a]
		}
	}
	function c()
	{
		this.constructor=d
	}
	c.prototype=b.prototype;
	d.prototype=new c;
	d.__super__=b.prototype;
	return d
},
__bind=function(a,b)
{
	return function()
	{
		return a.apply(b,arguments)
	}
};


Maze.Algorithms.Eller=(function()
{
	__extends(a,Maze.Algorithm);
	a.prototype.IN=4096;
	a.prototype.HORIZONTAL=0;
	a.prototype.VERTICAL=1;
	function a(c,b)
	{
		a.__super__.constructor.apply(this,arguments);
		this.state=new Maze.Algorithms.Eller.State(this.maze.width).populate();
		this.row=0;
		this.pending=true;
		this.initializeRow()
	}
	a.prototype.initializeRow=function()
	{
		this.column=0;
		return this.mode=this.HORIZONTAL
	};
	a.prototype.isFinal=function()
	{
		return this.row+1===this.maze.height
	};
	a.prototype.isIn=function(b,c)
	{
		return this.maze.isValid(b,c)&&this.maze.isSet(b,c,this.IN)
	};
	a.prototype.horizontalStep=function()
	{
		var b;
		b=false;
		while(!(b||this.column+1>=this.maze.width))
		{
			b=true;
			if(!this.state.isSame(this.column,this.column+1)&&(this.isFinal()||this.rand.nextBoolean()))
			{
				this.state.merge(this.column,this.column+1);
				this.maze.carve(this.column,this.row,Maze.Direction.E);
				this.updateAt(this.column,this.row);
				this.maze.carve(this.column+1,this.row,Maze.Direction.W);
				this.updateAt(this.column+1,this.row)
			}
			else
			{
				if(this.maze.isBlank(this.column,this.row))
				{
					this.maze.carve(this.column,this.row,this.IN);
					this.updateAt(this.column,this.row)
				}
				else
				{
					b=false
				}
			}
			this.column+=1
		}
		if(this.column+1>=this.maze.width)
		{
			if(this.maze.isBlank(this.column,this.row))
			{
				this.maze.carve(this.column,this.row,this.IN);
				this.updateAt(this.column,this.row)
			}
			if(this.isFinal())
			{
				return this.pending=false
			}
			else
			{
				this.mode=this.VERTICAL;
				this.next_state=this.state.next();
				this.verticals=this.computeVerticals();
				return this.eventAt(0,this.row)
			}
		}
	};
	a.prototype.computeVerticals=function()
	{
		var b;
		b=[];
		this.state.foreach(__bind(function(f,e)
		{
			var c,d;
			d=1+this.rand.nextInteger(e.length-1);
			c=this.rand.randomizeList(e).slice(0,d);
			return b=b.concat(c)
		},this));
		return b.sort(function(d,c)
		{
			return d-c
		})
	};
	a.prototype.verticalStep=function()
	{
		var b;
		b=this.verticals.pop();
		this.next_state.add(b,this.state.setFor(b));
		this.maze.carve(b,this.row,Maze.Direction.S);
		this.updateAt(b,this.row);
		this.maze.carve(b,this.row+1,Maze.Direction.N);
		this.updateAt(b,this.row+1);
		if(this.verticals.length===0)
		{
			this.state=this.next_state.populate();
			this.row+=1;
			this.initializeRow();
			return this.eventAt(0,this.row)
		}
	};
	a.prototype.step=function()
	{
		switch(this.mode)
		{
			case this.HORIZONTAL:this.horizontalStep();
			break;
			case this.VERTICAL:this.verticalStep()
		}
		return this.pending
	};
	return a
})();


Maze.Algorithms.Eller.State=(function()
{
	function a(c,b)
	{
		var d;
		this.width=c;
		this.counter=b;
		(d=this.counter)!=null?d:this.counter=0;
		this.sets={};
		this.cells=[]
	}
	a.prototype.next=function()
	{
		return new Maze.Algorithms.Eller.State(this.width,this.counter)
	};
	a.prototype.populate=function()
	{
		var b,e,c,d;
		b=0;
		while(b<this.width)
		{
			if(!this.cells[b])
			{
				e=(this.counter+=1);
				((d=(c=this.sets)[e])!=null?d:c[e]=[]).push(b);
				this.cells[b]=e
			}
			b+=1
		}
		return this
	};
	a.prototype.merge=function(h,i)
	{
		var b,g,d,f,c,e;
		g=this.cells[h];
		d=this.cells[i];
		this.sets[g]=this.sets[g].concat(this.sets[d]);
		e=this.sets[d];
		for(f=0,c=e.length;f<c;f++)
		{
			b=e[f];
			this.cells[b]=g
		}
		return delete this.sets[d]
	};
	a.prototype.isSame=function(d,c)
	{
		return this.cells[d]===this.cells[c]
	};
	a.prototype.add=function(b,e)
	{
		var c,d;
		this.cells[b]=e;
		((d=(c=this.sets)[e])!=null?d:c[e]=[]).push(b);
		return this
	};
	a.prototype.setFor=function(b)
	{
		return this.cells[b]
	};
	a.prototype.foreach=function(c)
	{
		var f,e,d,b;
		d=this.sets;b=[];
		for(f in d)
		{
			e=d[f];
			b.push(c(f,e))
		}
		return b
	};
	return a
})();


var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b){if(__hasProp.call(b,a)){d[a]=b[a]}}function c(){this.constructor=d}c.prototype=b.prototype;d.prototype=new c;d.__super__=b.prototype;return d
};

Maze.Algorithms.AldousBroder=(function()
{
	__extends(a,Maze.Algorithm);a.prototype.IN=4096;function a(c,b){a.__super__.constructor.apply(this,arguments);this.state=0;this.remaining=this.maze.width*this.maze.height}a.prototype.isCurrent=function(b,c){return this.x===b&&this.y===c};a.prototype.startStep=function(){this.x=this.rand.nextInteger(this.maze.width);this.y=this.rand.nextInteger(this.maze.height);this.maze.carve(this.x,this.y,this.IN);this.updateAt(this.x,this.y);this.remaining--;this.state=1;return this.carvedOnLastStep=true};a.prototype.runStep=function(){var e,b,h,g,k,i,d,j,f,c;e=false;if(this.remaining>0){f=this.rand.randomDirections();for(d=0,j=f.length;d<j;d++){b=f[d];h=this.x+Maze.Direction.dx[b];g=this.y+Maze.Direction.dy[b];if(this.maze.isValid(h,g)){c=[this.x,this.y,h,g],k=c[0],i=c[1],this.x=c[2],this.y=c[3];if(this.maze.isBlank(h,g)){this.maze.carve(k,i,b);this.maze.carve(this.x,this.y,Maze.Direction.opposite[b]);this.remaining--;e=true;if(this.remaining===0){delete this.x;delete this.y}}this.updateAt(k,i);this.updateAt(h,g);break}}}if(e!==this.carvedOnLastStep){this.eventAt(this.x,this.y)}this.carvedOnLastStep=e;return this.remaining>0};a.prototype.step=function(){switch(this.state){case 0:this.startStep();break;case 1:this.runStep()}return this.remaining>0};return a
})();

var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b){if(__hasProp.call(b,a)){d[a]=b[a]}}function c(){this.constructor=d}c.prototype=b.prototype;d.prototype=new c;d.__super__=b.prototype;return d
},
__bind=function(a,b)
{
	return function()
	{
		return a.apply(b,arguments)
	}
};

Maze.Algorithms.RecursiveBacktracker=(function()
{
	__extends(a,Maze.Algorithm);
	a.prototype.IN=4096;
	a.prototype.STACK=8192;
	a.prototype.START=1;
	a.prototype.RUN=2;
	a.prototype.DONE=3;
	function a(c,b)
	{
		a.__super__.constructor.apply(this,arguments);
		this.state=this.START;
		this.stack=[]
	}
	a.prototype.step=function()
	{
		switch(this.state)
		{
			case this.START:
				this.startStep();
				break;
			case this.RUN:
				this.runStep()
		}
		return this.state!==this.DONE
	};
	a.prototype.startStep=function()
	{
		var b,d,c;c=[this.rand.nextInteger(this.maze.width),this.rand.nextInteger(this.maze.height)],b=c[0],d=c[1];
		this.maze.carve(b,d,this.IN|this.STACK);
		this.updateAt(b,d);
		this.stack.push
		({
			x:b,y:d,dirs:this.rand.randomDirections()
		});
		this.state=this.RUN;
		return this.carvedOnLastStep=true
	};
	a.prototype.runStep=function()
	{
		var d,c,b,e;
		while(true)
		{
			d=this.stack[this.stack.length-1];
			c=d.dirs.pop();
			b=d.x+Maze.Direction.dx[c];
			e=d.y+Maze.Direction.dy[c];
			if(this.maze.isValid(b,e))
			{
				if(this.maze.isBlank(b,e))
				{
					this.stack.push
					({
						x:b,y:e,dirs:this.rand.randomDirections()
					});
					this.maze.carve(d.x,d.y,c);
					this.updateAt(d.x,d.y);
					this.maze.carve(b,e,Maze.Direction.opposite[c]|this.STACK);
					this.updateAt(b,e);
					if(!this.carvedOnLastStep)
					{
						this.eventAt(b,e)
					}
					this.carvedOnLastStep=true;
					break
				}
				else
				{
					if(this.canWeave(c,b,e))
					{
						this.performWeave(c,d.x,d.y,__bind(function(f,g)
						{
							this.stack.push({x:f,y:g,dirs:this.rand.randomDirections()});
							if(!this.carvedOnLastStep)
							{
								this.eventAt(f,g)
							}
							return this.maze.carve(f,g,this.STACK)
						},this));
						this.carvedOnLastStep=true;
						break
					}
				}
			}
			if(d.dirs.length===0)
			{
				this.maze.uncarve(d.x,d.y,this.STACK);
				this.updateAt(d.x,d.y);
				if(this.carvedOnLastStep)
				{
					this.eventAt(d.x,d.y)
				}
				this.stack.pop();
				this.carvedOnLastStep=false;
				break
			}
		}
		if(this.stack.length===0)
		{
			return this.state=this.DONE
		}
	};
	a.prototype.isStack=function(b,c)
	{
		return this.maze.isSet(b,c,this.STACK)
	};
	return a
})();


var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b)
	{
		if(__hasProp.call(b,a))
		{
			d[a]=b[a]
		}
	}
	function c()
	{
		this.constructor=d
	}
	c.prototype=b.prototype;
	d.prototype=new c;
	d.__super__=b.prototype;
	return d
};

Maze.Algorithms.BinaryTree=(function()
{
	__extends(a,Maze.Algorithm);
	a.prototype.IN=4096;
	function a(d,b)
	{
		var c;
		a.__super__.constructor.apply(this,arguments);
		this.x=0;
		this.y=0;
		switch((c=b.input)!=null?c:"nw")
		{
			case"nw":
				this.bias=Maze.Direction.N|Maze.Direction.W;
				break;
			case"ne":
				this.bias=Maze.Direction.N|Maze.Direction.E;
				break;
			case"sw":
				this.bias=Maze.Direction.S|Maze.Direction.W;
				break;
			case"se":
				this.bias=Maze.Direction.S|Maze.Direction.E
		}
		this.northBias=(this.bias&Maze.Direction.N)!==0;
		this.southBias=(this.bias&Maze.Direction.S)!==0;
		this.eastBias=(this.bias&Maze.Direction.E)!==0;
		this.westBias=(this.bias&Maze.Direction.W)!==0
	}
	a.prototype.step=function()
	{
		var d,c,b,e;
		if(this.y>=this.maze.height)
		{
			return false
		}
		c=[];
		if(this.northBias&&this.y>0)
		{
			c.push(Maze.Direction.N)
		}
		if(this.southBias&&this.y+1<this.maze.height)
		{
			c.push(Maze.Direction.S)
		}
		if(this.westBias&&this.x>0)
		{
			c.push(Maze.Direction.W)
		}
		if(this.eastBias&&this.x+1<this.maze.width)
		{
			c.push(Maze.Direction.E)
		}
		d=this.rand.randomElement(c);
		if(d)
		{
			b=this.x+Maze.Direction.dx[d];
			e=this.y+Maze.Direction.dy[d];
			this.maze.carve(this.x,this.y,d);
			this.maze.carve(b,e,Maze.Direction.opposite[d]);
			this.updateAt(b,e)
		}
		else
		{
			this.maze.carve(this.x,this.y,this.IN)
		}
		this.updateAt(this.x,this.y);
		this.x++;
		if(this.x>=this.maze.width)
		{
			this.x=0;
			this.y++;
			this.eventAt(this.x,this.y)
		}
		return this.y<this.maze.height
	};
	return a
})();


var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b)
	{
		if(__hasProp.call(b,a))
		{
			d[a]=b[a]
		}
	}
	function c()
	{
		this.constructor=d
	}
	c.prototype=b.prototype;
	d.prototype=new c;
	d.__super__=b.prototype;
	return d
};

Maze.Algorithms.RecursiveDivision=(function()
{
	__extends(a,Maze.Algorithm);
	a.prototype.HORIZONTAL=1;
	a.prototype.VERTICAL=2;
	function a(c,b)
	{
		a.__super__.constructor.apply(this,arguments);
		this.stack=
		[{
			x:0,y:0,
			width:this.maze.width,
			height:this.maze.height
		}]
	}
	a.prototype.chooseOrientation=function(c,b)
	{
		if(c<b)
		{
			return this.HORIZONTAL
		}
		else
		{
			if(b<c)
			{
				return this.VERTICAL
			}
			else
			{
				if(this.rand.nextBoolean())
				{
					return this.HORIZONTAL
				}
				else
				{
					return this.VERTICAL
				}
			}
		}
	};
	a.prototype.step=function()
	{
		var e,r,q,p,b,d,j,i,f,o,n,l,c,h,g,m,k;
		if(this.stack.length>0)
		{
			l=this.stack.pop();
			b=this.chooseOrientation(l.width,l.height)===this.HORIZONTAL;
			h=l.x+(b?0:this.rand.nextInteger(l.width-2));
			g=l.y+(b?this.rand.nextInteger(l.height-2):0);
			o=h+(b?this.rand.nextInteger(l.width):0);
			n=g+(b?0:this.rand.nextInteger(l.height));
			r=b?1:0;
			q=b?0:1;
			d=b?l.width:l.height;
			e=b?Maze.Direction.S:Maze.Direction.E;
			f=Maze.Direction.opposite[e];
			while(d>0)
			{
				if(h!==o||g!==n)
				{
					this.maze.carve(h,g,e);
					this.updateAt(h,g);
					j=h+Maze.Direction.dx[e];
					i=g+Maze.Direction.dy[e];
					this.maze.carve(j,i,f);
					this.updateAt(j,i)
				}
				h+=r;
				g+=q;
				d-=1
			}
			c=b?l.width:h-l.x+1;
			p=b?g-l.y+1:l.height;
			if(c>=2&&p>=2)
			{
				this.stack.push
				({
					x:l.x,y:l.y,width:c,height:p
				})
			}
			m=b?l.x:h+1;
			k=b?g+1:l.y;
			c=b?l.width:l.x+l.width-h-1;
			p=b?l.y+l.height-g-1:l.height;
			if(c>=2&&p>=2)
			{
				this.stack.push
				({
					x:m,y:k,width:c,height:p
				})
			}
		}
		return this.stack.length>0
	};
	return a
})();

var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b){if(__hasProp.call(b,a)){d[a]=b[a]}}function c(){this.constructor=d}c.prototype=b.prototype;d.prototype=new c;d.__super__=b.prototype;return d
};


Maze.Algorithms.Sidewinder=(function()
{
	__extends(a,Maze.Algorithm);a.prototype.IN=4096;function a(c,b){a.__super__.constructor.apply(this,arguments);this.x=0;this.y=0;this.runStart=0;this.state=0}a.prototype.startStep=function(){this.maze.carve(this.x,this.y,this.IN);this.updateAt(this.x,this.y);return this.state=1};a.prototype.runStep=function(){var b;if(this.y>0&&(this.x+1>=this.maze.width||this.rand.nextBoolean())){b=this.runStart+this.rand.nextInteger(this.x-this.runStart+1);this.maze.carve(b,this.y,Maze.Direction.N);this.maze.carve(b,this.y-1,Maze.Direction.S);this.updateAt(b,this.y);this.updateAt(b,this.y-1);if(this.x-this.runStart>0){this.eventAt(this.x,this.y)}this.runStart=this.x+1}else{if(this.x+1<this.maze.width){this.maze.carve(this.x,this.y,Maze.Direction.E);this.maze.carve(this.x+1,this.y,Maze.Direction.W);this.updateAt(this.x,this.y);this.updateAt(this.x+1,this.y)}else{this.maze.carve(this.x,this.y,this.IN);this.updateAt(this.x,this.y)}}this.x++;if(this.x>=this.maze.width){this.x=0;this.runStart=0;return this.y++}};a.prototype.step=function(){if(this.y>=this.maze.height){return false}switch(this.state){case 0:this.startStep();break;case 1:this.runStep()}return this.y<this.maze.height};return a
})();

var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b)
	{
		if(__hasProp.call(b,a))
		{
			d[a]=b[a]
		}
	}
	function c()
	{
		this.constructor=d
	}
	c.prototype=b.prototype;
	d.prototype=new c;
	d.__super__=b.prototype;
	return d
},
__bind=function(a,b)
{
	return function()
	{
		return a.apply(b,arguments)
	}
};

Maze.Algorithms.GrowingTree=(function()
{
	__extends(a,Maze.Algorithm);
	a.prototype.QUEUE=4096;
	function a(d,b)
	{
		var c;
		a.__super__.constructor.apply(this,arguments);
		this.cells=[];
		this.state=0;
		this.script=new Maze.Algorithms.GrowingTree.Script((c=b.input)!=null?c:"random",this.rand)
	}
	a.prototype.inQueue=function(b,c)
	{
		return this.maze.isSet(b,c,this.QUEUE)
	};
	a.prototype.enqueue=function(b,c)
	{
		this.maze.carve(b,c,this.QUEUE);
		return this.cells.push({x:b,y:c})
	};
	a.prototype.nextCell=function()
	{
		return this.script.nextIndex(this.cells.length)
	};
	a.prototype.startStep=function()
	{
		var b,d,c;
		c=[this.rand.nextInteger(this.maze.width),this.rand.nextInteger(this.maze.height)],b=c[0],d=c[1];
		this.enqueue(b,d);this.updateAt(b,d);
		return this.state=1
	};
	a.prototype.runStep=function()
	{
		var c,h,e,b,i,g,d,f;
		e=this.nextCell();
		c=this.cells[e];
		f=this.rand.randomDirections();
		for(g=0,d=f.length;g<d;g++)
		{
			h=f[g];
			b=c.x+Maze.Direction.dx[h];
			i=c.y+Maze.Direction.dy[h];
			if(this.maze.isValid(b,i))
			{
				if(this.maze.isBlank(b,i))
				{
					this.maze.carve(c.x,c.y,h);
					this.maze.carve(b,i,Maze.Direction.opposite[h]);
					this.enqueue(b,i);
					this.updateAt(c.x,c.y);
					this.updateAt(b,i);
					return
				}
				else
				{
					if(this.canWeave(h,b,i))
					{
						this.performWeave(h,c.x,c.y,__bind(function(k,j){return this.enqueue(k,j)},this));return
					}
				}
			}
		}
		this.cells.splice(e,1);
		this.maze.uncarve(c.x,c.y,this.QUEUE);
		return this.updateAt(c.x,c.y)
	};
	a.prototype.step=function()
	{
		switch(this.state)
		{
			case 0:
				this.startStep();
				break;
			case 1:
				this.runStep()
		}
		return this.cells.length>0
	};
	return a
})();

Maze.Algorithms.GrowingTree.Script=(function()
{
	function a(c,f)
	{
		var i,e,d,h,b,g;
		this.rand=f;
		this.commands=(function()
		{
			var m,k,l,j;
			l=c.split(/;|\r?\n/);j=[];
			for(m=0,k=l.length;m<k;m++)
			{
				i=l[m];
				b=0;
				h=(function()
				{
					var q,o,p,r,n;
					p=i.split(/,/);
					n=[];
					for(q=0,o=p.length;q<o;q++)
					{
						d=p[q];r=d.split(/:/),e=r[0],g=r[1];
						b+=parseInt(g!=null?g:100);
						n.push
						({
							name:e.replace(/\s/,""),weight:b
						})
					}
					return n
				})();
				
				j.push
				({
					total:b,parts:h
				})
			}
			return j
		})();
		
		this.current=0
	}
	a.prototype.nextIndex=function(d)
	{
		var h,c,g,f,b,e;
		h=this.commands[this.current];
		this.current=(this.current+1)%this.commands.length;
		g=this.rand.nextInteger(h.total);
		e=h.parts;
		for(f=0,b=e.length;f<b;f++)
		{
			c=e[f];if(g<c.weight)
			{
				switch(c.name)
				{
					case"random":
						return this.rand.nextInteger(d);
					case"newest":
						return d-1;
					case"middle":
						return Math.floor(d/2);
					case"oldest":
						return 0;
					default:
						throw"invalid weight key `"+c.name+"'"
				}
			}
		}
	};
	return a
})();

var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b)
	{
		if(__hasProp.call(b,a))
		{
			d[a]=b[a]
		}
	}
	function c()
	{
		this.constructor=d
	}
	c.prototype=b.prototype;
	d.prototype=new c;
	d.__super__=b.prototype;
	return d
};

Maze.Algorithms.Prim=(function()
{
	__extends(a,Maze.Algorithm);
	a.prototype.IN=4096;
	a.prototype.FRONTIER=8192;
	a.prototype.START=1;
	a.prototype.EXPAND=2;
	a.prototype.DONE=3;
	function a(c,b)
	{
		a.__super__.constructor.apply(this,arguments);
		this.frontierCells=[];
		this.state=this.START
	}
	a.prototype.isOutside=function(b,c)
	{
		return this.maze.isValid(b,c)&&this.maze.isBlank(b,c)
	};
	a.prototype.isInside=function(b,c)
	{
		return this.maze.isValid(b,c)&&this.maze.isSet(b,c,this.IN)
	};
	a.prototype.isFrontier=function(b,c)
	{
		return this.maze.isValid(b,c)&&this.maze.isSet(b,c,this.FRONTIER)
	};
	a.prototype.addFrontier=function(b,c)
	{
		if(this.isOutside(b,c))
		{
			this.frontierCells.push({x:b,y:c});
			this.maze.carve(b,c,this.FRONTIER);
			return this.updateAt(b,c)
		}
	};
	a.prototype.markCell=function(b,c)
	{
		this.maze.carve(b,c,this.IN);
		this.maze.uncarve(b,c,this.FRONTIER);
		this.updateAt(b,c);
		this.addFrontier(b-1,c);
		this.addFrontier(b+1,c);
		this.addFrontier(b,c-1);
		return this.addFrontier(b,c+1)
	};
	a.prototype.findNeighborsOf=function(b,d)
	{
		var c;
		c=[];
		if(this.isInside(b-1,d))
		{
			c.push(Maze.Direction.W)
		}
		if(this.isInside(b+1,d))
		{
			c.push(Maze.Direction.E)
		}
		if(this.isInside(b,d-1))
		{
			c.push(Maze.Direction.N)
		}
		if(this.isInside(b,d+1))
		{
			c.push(Maze.Direction.S)
		}
		return c
	};
	a.prototype.startStep=function()
	{
		this.markCell(this.rand.nextInteger(this.maze.width),this.rand.nextInteger(this.maze.height));
		return this.state=this.EXPAND};
		a.prototype.expandStep=function()
		{
			var c,g,b,d,h,e,f;
			c=this.rand.removeRandomElement(this.frontierCells);
			g=this.rand.randomElement(this.findNeighborsOf(c.x,c.y));
			b=c.x+Maze.Direction.dx[g];
			h=c.y+Maze.Direction.dy[g];
			if(this.maze.isWeave&&this.maze.isPerpendicular(b,h,g)){d=b+Maze.Direction.dx[g];
			e=h+Maze.Direction.dy[g];
			if(this.isInside(d,e))
			{
				this.performThruWeave(b,h);
				this.updateAt(b,h);
				f=[d,e],b=f[0],h=f[1]
			}
		}
		this.maze.carve(b,h,Maze.Direction.opposite[g]);
		this.updateAt(b,h);
		this.maze.carve(c.x,c.y,g);
		this.markCell(c.x,c.y);
		if(this.frontierCells.length===0)
		{
			return this.state=this.DONE
		}
	};
	a.prototype.step=function()
	{
		switch(this.state)
		{
			case this.START:
				this.startStep();
				break;
			case this.EXPAND:
				this.expandStep()
		}
		return this.state!==this.DONE
	};
	return a
})();

var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b)
	{
		if(__hasProp.call(b,a))
		{
			d[a]=b[a]
		}
	}
	function c()
	{
		this.constructor=d
	}
	c.prototype=b.prototype;
	d.prototype=new c;
	d.__super__=b.prototype;
	return d
},
__bind=function(a,b)
{
	return function()
	{
		return a.apply(b,arguments)
	}
};


///
Maze.Algorithms.HuntAndKill=(function()
{
	__extends(a,Maze.Algorithm);
	a.prototype.IN=4096;
	function a(c,b)
	{
		a.__super__.constructor.apply(this,arguments);
		this.state=0
	}
	a.prototype.isCurrent=function(b,d)
	{
		var c;
		return((c=this.x)!=null?c:b)===b&&this.y===d
	};
	a.prototype.isWalking=function()
	{
		return this.state===1
	};
	a.prototype.isHunting=function()
	{
		return this.state===2
	};
	
	var lastCheckedX=0, lastCheckedY=0;
	a.prototype.callbackRow=function(e)//линия проверки
	{
		var b,d,c;
		c=[];
		for(b=0,d=this.maze.width;
		(0<=d?b<d:b>d);
		(0<=d?b+=1:b-=1))
		{
			c.push(this.updateAt(b,e))
		}
		lastCheckedY=e;
		return c
	};
	a.prototype.startStep=function()
	{
		this.x=this.rand.nextInteger(this.maze.width);
		this.y=this.rand.nextInteger(this.maze.height);
		this.maze.carve(this.x,this.y,this.IN);
		this.updateAt(this.x,this.y);
		return this.state=1
	};
	a.prototype.walkStep=function()
	{
		var i,g,f,k,h,d,j,e,c,b;
		e=this.rand.randomDirections();
		for(d=0,j=e.length;d<j;d++)
		{
			i=e[d];
			g=this.x+Maze.Direction.dx[i];
			f=this.y+Maze.Direction.dy[i];
			if(this.maze.isValid(g,f))
			{
				if(this.maze.isBlank(g,f))
				{
					c=[this.x,this.y,g,f],k=c[0],h=c[1],this.x=c[2],this.y=c[3];
					this.maze.carve(k,h,i);
					this.maze.carve(g,f,Maze.Direction.opposite[i]);
					this.updateAt(k,h);
					this.updateAt(g,f);
					return
				}
				else
				{
					if(this.canWeave(i,g,f))
					{
						this.performWeave(i,this.x,this.y,__bind(function(l,n)
						{
							var m;
							return m=[this.x,this.y,l,n],l=m[0],n=m[1],this.x=m[2],this.y=m[3],m
						},this));
						return
					}
				}
			}
		}
		b=[this.x,this.y],k=b[0],h=b[1];
		delete this.x;
		delete this.y;
		this.updateAt(k,h);
		this.eventAt(k,h);
		this.y=0;///this.y=0;
		this.callbackRow(lastCheckedY);//this.callbackRow(0);//lastCheckedY
		return this.state=2
	};
	a.prototype.huntStep=function()
	{
		var f,d,c,g,b,e;
		for(b=0,e=this.maze.width;
		(0<=e?b<e:b>e);
		(0<=e?b+=1:b-=1))
		{
			if(this.maze.isBlank(b,this.y))
			{
				d=[];
				if(this.y>0&&!this.maze.isBlank(b,this.y-1))
				{
					d.push(Maze.Direction.N)
				}
				if(b>0&&!this.maze.isBlank(b-1,this.y))
				{
					d.push(Maze.Direction.W)
				}
				if(this.y+1<this.maze.height&&!this.maze.isBlank(b,this.y+1))
				{
					d.push(Maze.Direction.S)
				}
				if(b+1<this.maze.width&&!this.maze.isBlank(b+1,this.y))
				{
					d.push(Maze.Direction.E)
				}
				f=this.rand.randomElement(d);
				if(f)
				{
					this.x=b;
					c=this.x+Maze.Direction.dx[f];
					g=this.y+Maze.Direction.dy[f];
					this.maze.carve(this.x,this.y,f);
					this.maze.carve(c,g,Maze.Direction.opposite[f]);
					this.state=1;
					this.updateAt(c,g);
					this.callbackRow(this.y);///this.callbackRow(this.y);//lastCheckedY
					this.y=lastCheckedY;///
					this.eventAt(c,g);
					return
				}
			}
		}
		this.y++;
		this.callbackRow(lastCheckedY);///this.callbackRow(this.y-1);
		if(this.y>=this.maze.height)
		{
			this.state=3;
			delete this.x;
			return delete this.y
		}
		else
		{
			return this.callbackRow(this.y-1)//this.callbackRow(this.y)
		}
	};
	a.prototype.step=function()
	{
		switch(this.state)
		{
			case 0:
				this.startStep();
				break;
			case 1:
				this.walkStep();
				break;
			case 2:
				this.huntStep()
		}
		return this.state!==3
	};
	return a
})();

var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b)
	{
		if(__hasProp.call(b,a))
		{
			d[a]=b[a]
		}
	}
	function c()
	{
		this.constructor=d
	}
	c.prototype=b.prototype;
	d.prototype=new c;
	d.__super__=b.prototype;
	return d
};

Maze.Algorithms.Kruskal=(function()
{
	__extends(a,Maze.Algorithm);
	a.prototype.WEAVE=1;
	a.prototype.JOIN=2;
	function a(i,c)
	{
		var b,h,d,g,f,e;
		a.__super__.constructor.apply(this,arguments);
		this.sets=[];
		this.edges=[];
		for(h=0,d=this.maze.height;
		(0<=d?h<d:h>d);
		(0<=d?h+=1:h-=1))
		{
			this.sets.push([]);
			for(b=0,g=this.maze.width;(0<=g?b<g:b>g);(0<=g?b+=1:b-=1))
			{
				this.sets[h].push(new Maze.Algorithms.Kruskal.Tree());
				if(h>0)
				{
					this.edges.push
					({
						x:b,y:h,direction:Maze.Direction.N
					})
				}
				if(b>0)
				{
					this.edges.push
					({
						x:b,y:h,direction:Maze.Direction.W
					})
				}
			}
		}
		this.rand.randomizeList(this.edges);
		this.weaveMode=(f=c.weaveMode)!=null?f:"onePhase";
		if(typeof this.weaveMode==="function")
		{
			this.weaveMode=this.weaveMode()
		}
		this.weaveDensity=(e=c.weaveDensity)!=null?e:80;
		if(typeof this.weaveDensity==="function")
		{
			this.weaveDensity=this.weaveDensity()
		}
		this.state=(this.maze.isWeave!=null)&&this.weaveMode==="twoPhase"?this.WEAVE:this.JOIN
	}
	a.prototype.connect=function(c,e,b,d,f)
	{
		this.sets[e][c].connect(this.sets[d][b]);this.maze.carve(c,e,f);this.updateAt(c,e);this.maze.carve(b,d,Maze.Direction.opposite[f]);return this.updateAt(b,d)
	};
	a.prototype.weaveStep=function()
	{
		var h,n,m,r,p,o,i,l,k,t,s,e,q,j,g,f,c,b,d;
		if(!(this.x!=null))
		{
			this.y=1;this.x=1
		}
		d=[];
		while(this.state===this.WEAVE)
		{
			if(this.maze.isBlank(this.x,this.y)&&this.rand.nextInteger(100)<this.weaveDensity)
			{
				j=[this.x,this.y-1],p=j[0],o=j[1];
				g=[this.x-1,this.y],t=g[0],s=g[1];
				f=[this.x+1,this.y],n=f[0],m=f[1];
				c=[this.x,this.y+1],l=c[0],k=c[1];
				i=!this.sets[o][p].isConnectedTo(this.sets[k][l])&&!this.sets[s][t].isConnectedTo(this.sets[m][n]);
				if(i)
				{
					this.sets[o][p].connect(this.sets[k][l]);
					this.sets[s][t].connect(this.sets[m][n]);
					if(this.rand.nextBoolean())
					{
						this.maze.carve(this.x,this.y,Maze.Direction.E|Maze.Direction.W|Maze.Direction.U)
					}
					else
					{
						this.maze.carve(this.x,this.y,Maze.Direction.N|Maze.Direction.S|Maze.Direction.U)
					}
					this.maze.carve(p,o,Maze.Direction.S);
					this.maze.carve(t,s,Maze.Direction.E);
					this.maze.carve(n,m,Maze.Direction.W);
					this.maze.carve(l,k,Maze.Direction.N);
					this.updateAt(this.x,this.y);
					this.updateAt(p,o);
					this.updateAt(t,s);
					this.updateAt(n,m);
					this.updateAt(l,k);
					r=[];b=this.edges;
					for(e=0,q=b.length;e<q;e++)
					{
						h=b[e];
						if((h.x===this.x&&h.y===this.y)||(h.x===n&&h.y===m&&h.direction===Maze.Direction.W)||(h.x===l&&h.y===k&&h.direction===Maze.Direction.N))
						{
							continue
						}r.push(h)
					}
					this.edges=r;
					break
				}
			}
			this.x++;
			d.push(this.x>=this.maze.width-1?(this.x=1,this.y++,this.y>=this.maze.height-1?this.state=this.JOIN:void 0):void 0)
		}
		return d
	};
	a.prototype.joinStep=function()
	{
		var b,c,k,j,m,h,l,i,g,e,f,d;
		d=[];
		while(this.edges.length>0)
		{
			b=this.edges.pop();
			j=b.x+Maze.Direction.dx[b.direction];
			h=b.y+Maze.Direction.dy[b.direction];
			i=this.sets[b.y][b.x];
			g=this.sets[h][j];
			if((this.maze.isWeave!=null)&&this.weaveMode==="onePhase"&&this.maze.isPerpendicular(j,h,b.direction))
			{
				m=j+Maze.Direction.dx[b.direction];
				l=h+Maze.Direction.dy[b.direction];
				e=null;
				for(k=0,f=this.edges.length;(0<=f?k<f:k>f);(0<=f?k+=1:k-=1))
				{
					c=this.edges[k];
					if(c.x===j&&c.y===h&&c.direction===b.direction)
					{
						this.edges.splice(k,1);
						e=this.sets[l][m];
						break
					}
				}
				if(e&&!i.isConnectedTo(e))
				{
					this.connect(b.x,b.y,m,l,b.direction);
					this.performThruWeave(j,h);
					this.updateAt(j,h);
					break
				}
				else
				{
					if(!i.isConnectedTo(g))
					{
						this.connect(b.x,b.y,j,h,b.direction);
						break
					}
				}
			}
			else
			{
				if(!i.isConnectedTo(g))
				{
					this.connect(b.x,b.y,j,h,b.direction);
					break
				}
			}
		}
		return d
	};
	a.prototype.step=function()
	{
		switch(this.state)
		{
			case this.WEAVE:
				this.weaveStep();
				break;
			case this.JOIN:
				this.joinStep()
		}
		return this.edges.length>0
	};
	return a
})();

Maze.Algorithms.Kruskal.Tree=(function()
{
	function a(){this.up=null}a.prototype.root=function(){if(this.up){return this.up.root()}else{return this}};a.prototype.isConnectedTo=function(b){return this.root()===b.root()};a.prototype.connect=function(b){return b.root().up=this};return a
})();
									
var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b)
	{
		if(__hasProp.call(b,a))
		{
			d[a]=b[a]
		}
	}
	function c()
	{
		this.constructor=d
	}
	c.prototype=b.prototype;
	d.prototype=new c;
	d.__super__=b.prototype;
	return d
};


Maze.Algorithms.Wilson=(function()
{
	__extends(a,Maze.Algorithm);
	a.prototype.IN=4096;
	function a(c,b)
	{
		a.__super__.constructor.apply(this,arguments);
		this.state=0;
		this.remaining=this.maze.width*this.maze.height;
		this.visits={}
	}
	a.prototype.isCurrent=function(b,c)
	{
		return this.x===b&&this.y===c
	};
	a.prototype.isVisited=function(b,c)
	{
		return this.visits[""+b+":"+c]!=null
	};
	a.prototype.addVisit=function(b,d,c)
	{
		return this.visits[""+b+":"+d]=c!=null?c:0
	};
	a.prototype.exitTaken=function(b,c)
	{
		return this.visits[""+b+":"+c]
	};
	a.prototype.startStep=function()
	{
		var b,c;
		b=this.rand.nextInteger(this.maze.width);
		c=this.rand.nextInteger(this.maze.height);
		this.maze.carve(b,c,this.IN);
		this.updateAt(b,c);
		this.remaining--;
		return this.state=1
	};
	a.prototype.startWalkStep=function()
	{
		var b;
		this.visits={};
		b=[];
		while(true)
		{
			this.x=this.rand.nextInteger(this.maze.width);
			this.y=this.rand.nextInteger(this.maze.height);
			if(this.maze.isBlank(this.x,this.y))
			{
				this.eventAt(this.x,this.y);
				this.state=2;
				this.start={x:this.x,y:this.y};
				this.addVisit(this.x,this.y);
				this.updateAt(this.x,this.y);
				break
			}
		}
		return b
	};
	a.prototype.walkStep=function()
	{
		var i,g,f,k,h,d,j,e,b,c;
		e=this.rand.randomDirections();
		c=[];
		for(d=0,j=e.length;d<j;d++)
		{
			i=e[d];g=this.x+Maze.Direction.dx[i];
			f=this.y+Maze.Direction.dy[i];
			if(this.maze.isValid(g,f))
			{
				b=[this.x,this.y,g,f],k=b[0],h=b[1],this.x=b[2],this.y=b[3];
				this.addVisit(k,h,i);
				this.updateAt(k,h);
				this.updateAt(g,f);
				if(!this.maze.isBlank(g,f))
				{
					this.x=this.start.x;this.y=this.start.y;this.state=3;this.eventAt(this.x,this.y)
				}
				break
			}
		}
		return c
	};
	a.prototype.resetVisits=function()
	{
		var d,e,b,h,f,g,c;
		f=this.visits;
		c=[];
		for(e in f)
		{
			d=f[e];
			g=e.split(":"),b=g[0],h=g[1];
			delete this.visits[e];
			c.push(this.updateAt(b,h))
		}
		return c
	};
	a.prototype.runStep=function()
	{
		var d,c,g,b,f,e;
		if(this.remaining>0)
		{
			d=this.exitTaken(this.x,this.y);
			c=this.x+Maze.Direction.dx[d];
			g=this.y+Maze.Direction.dy[d];
			if(!this.maze.isBlank(c,g))
			{
				this.resetVisits();
				this.state=1
			}
			this.maze.carve(this.x,this.y,d);
			this.maze.carve(c,g,Maze.Direction.opposite[d]);
			e=[this.x,this.y,c,g],b=e[0],f=e[1],this.x=e[2],this.y=e[3];
			if(this.state===1)
			{
				delete this.x;
				delete this.y
			}
			this.updateAt(b,f);
			this.updateAt(c,g);
			this.remaining--
		}
		return this.remaining>0
	};
	a.prototype.step=function()
	{
		if(this.remaining>0)
		{
			switch(this.state)
			{
				case 0:
					this.startStep();
					break;
				case 1:
					this.startWalkStep();
					break;
				case 2:
					this.walkStep();
					break;
				case 3:
					this.runStep()
			}
		}
		return this.remaining>0
	};
	return a
})();

var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b)
	{
		if(__hasProp.call(b,a))
		{
			d[a]=b[a]
		}
	}
	function c()
	{
		this.constructor=d
	}
	c.prototype=b.prototype;
	d.prototype=new c;
	d.__super__=b.prototype;
	return d
};


Maze.Algorithms.Houston=(function()
{
	__extends(a,Maze.Algorithm);
	function a(c,b)
	{
		a.__super__.constructor.apply(this,arguments);
		this.options=b;
		this.threshold=2*this.maze.width*this.maze.height/3
	}
	a.prototype.isCurrent=function(b,c)
	{
		return this.worker.isCurrent(b,c)
	};
	a.prototype.isVisited=function(b,c)
	{
		return this.worker.isVisited(b,c)
	};
	a.prototype.step=function()
	{
		var d,b,e,c;
		if(this.worker==null)
		{
			this.worker=new Maze.Algorithms.AldousBroder(this.maze,this.options);
			this.worker.onUpdate(this.updateCallback);
			this.worker.onEvent(this.eventCallback)
		}
		if(this.worker.remaining<this.threshold)
		{
			c=[this.worker.x,this.worker.y],b=c[0],e=c[1];
			delete this.worker.x;
			delete this.worker.y;
			this.updateAt(b,e);
			this.eventAt(b,e);
			d=new Maze.Algorithms.Wilson(this.maze,this.options);
			d.onUpdate(this.updateCallback);
			d.onEvent(this.eventCallback);
			d.state=1;
			d.remaining=this.worker.remaining;
			this.worker=d;
			this.step=function()
			{
				return this.worker.step()
			}
		}
		return this.worker.step()
	};
	return a
})();

var __hasProp=Object.prototype.hasOwnProperty,__extends=function(d,b)
{
	for(var a in b)
	{
		if(__hasProp.call(b,a))
		{
			d[a]=b[a]
		}
	}
	function c()
	{
		this.constructor=d
	}
	c.prototype=b.prototype;
	d.prototype=new c;
	d.__super__=b.prototype;
	return d
};
									
Maze.Algorithms.GrowingBinaryTree=(function()
{
	function a()
	{
		a.__super__.constructor.apply(this,arguments)
	}
	__extends(a,Maze.Algorithms.GrowingTree);
	a.prototype.runStep=function()
	{
		var k,g,i,h,f,e,c,j,d,b;
		h=this.nextCell();
		k=this.cells.splice(h,1)[0];
		this.maze.uncarve(k.x,k.y,this.QUEUE);
		this.updateAt(k.x,k.y);
		g=0;
		d=this.rand.randomDirections();
		b=[];
		for(c=0,j=d.length;c<j;c++)
		{
			i=d[c];
			f=k.x+Maze.Direction.dx[i];
			e=k.y+Maze.Direction.dy[i];
			if(this.maze.isValid(f,e)&&this.maze.isBlank(f,e))
			{
				this.maze.carve(k.x,k.y,i);
				this.maze.carve(f,e,Maze.Direction.opposite[i]);
				this.enqueue(f,e);
				this.updateAt(k.x,k.y);
				this.updateAt(f,e);
				g+=1;
				if(g>1)
				{
					return
				}
			}
		}
		return b
	};
	return a
})();