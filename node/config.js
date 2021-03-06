function CuteConfig(){
    var cfg = {
        db:{
            host     : 'localhost',
            user     : 'minidope',
            password : 'minidope',
            database : 'minidope'        
        },
        port:8080,
        log:{
            logLevel:"debug",
            logSize:5000,
        }
    };
    this.GetDataBaseConfig = function(){
        return {
            host     : 'localhost',
            user     : 'minidope',
            password : 'minidope',
            database : 'minidope',
            port:3306 ,
			dateStrings:true			
        };
    };
    this.GetPort = function(){
        return this.cfg.port;
    };
    this.GetLog = function(){
        return this.cfg.log;
    }
    this.GetStudentsInfoUrl = function(){
        return "https://test.buzaishudian.com/api/students";
    }
    this.GetParentProfileInfoUrl = function(){
        return "https://test.buzaishudian.com/api/parent-info";
    }
    this.GetLoginUrl = function(){
        return "https://test.buzaishudian.com/api/mini/user-id";
    }
    this.GetTeathersUrl = function(){
		return "https://test.buzaishudian.com/api/teachers";
	}
	this.GetBindPhoneUrl = function(){
		return "https://test.buzaishudian.com/api/mini/phone-bind";
	}
	this.GetVCode = function(){
		return "https://test.buzaishudian.com/api/mini/phone-vcode";
	}
	this.GetTeacherInfoByPhone = function(){
		return "https://test.buzaishudian.com/api/teacher-info";
    }
    this.GetCdnTokenUrl = function(){
        return "https://test.buzaishudian.com/api/upload-auth";
    }
}

module.exports = CuteConfig;