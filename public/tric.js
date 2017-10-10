var isios=(/(ipod|iphone|ipad)/i).test(navigator.userAgent);//ios
var isandroid=(/android/i).test(navigator.userAgent);//android
var isapple=(/applewebkit/i).test(navigator.userAgent); //safari,chrome

// for ios
if(isios) {
  try {
    window.location.replace("fb268536283583339://","newsite")
  } catch(e) {

  }
  finally {
    window.setTimeout('window.location.replace("itms-apps://itunes.apple.com/kr/app/%EB%8F%99%EB%82%A8%EC%95%84-%ED%83%9C%EA%B5%AD-%EC%97%AC%ED%96%89-%EB%B2%A0%ED%8A%B8%EB%82%A8-%EC%97%AC%ED%96%89-%EA%B7%B8%EB%A6%AC%EA%B3%A0/id1222473224?mt=8","newsite")',500)
  }
}

// for android
if(isandroid) {
  window.location.replace("intent://write?title=blogTitle&content=blogContent#Intent;scheme=naverblog;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.nhn.android.blog;end");
}
