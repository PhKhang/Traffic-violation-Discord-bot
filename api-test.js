const HTMLParser = require('node-html-parser');

root = HTMLParser.parse(`
    <br /><br />
<center style='font-size: 18px; line-height: 25px;'>
        <img src='./checkPN.png' style='height: 90px; margin-bottom: 10px;' /></br>
        <h3>BIỂN SỐ<br /> <b class='h1'>59E225300</b></h3>
        <h3>Không tìm thấy vi phạm phạt nguội!</h3>
        <p style='font-weight:300;'>Thông thường các lỗi phạt nguội (nếu có) sẽ có kết quả tra cứu từ 3 ngày đến 15
                ngày. Bạn hãy thường xuyên kiểm tra phạt nguội để có kết quả chính xác nhất.</p>
</center>
<center>
        <div class="css-tv">
                <p class="csstv2" style="font-size:12px;">Phần mềm đã có mặt trên CH Play và AppStore tải về miễn phí để
                        theo dõi phạt nguội xe của bạn</p>
                <div class="csstv3"><a class="css-ftuvwr"
                                href="https://play.google.com/store/apps/details?id=tracuu.phatnguoi.oto.xemay"
                                title="Tra Phạt Nguội CH Play">
                                <img class="csstv4" src="https://phatnguoixe.com/template/Default/images/ch-play-vi.png"
                                        alt="Tải về từ Google Play" style="width: 125px; margin-right: 10px;"></a>
                        <a class="css-hk" href="https://apps.apple.com/app/id1617941075" title="Tra Phạt Nguội AppStore"
                                target="_blank">
                                <img class="css-hr" src="https://phatnguoixe.com/template/Default/images/apple-vi.svg"
                                        alt="Tải về từ AppStore" style="width: 115px;">
                        </a>
                </div>
        </div>
</center>
<center style='font-size: 18px; line-height: 25px;'><br /><button class="css-tt submit" type="button" id="submit2"
                style="border-color: red; color: red;padding:5px 10px;">🔂 Kiểm Tra Lại 1 Lần Nữa</button></br></br>
        <hr />
        <p><i style="font-size:16px;line-height: 18px!important;">Cảm ơn quý vị đã sử dụng ứng dụng, Xin quý vị hãy dành
                        chút thời gian để ủng hộ Tác giả bằng cách nhấn nút Chia sẻ Ứng dụng lên Facebook, Zalo...để mọi
                        người cùng biết đến.</i>
        <p>
                <a class="css-tt" href="https://www.facebook.com/sharer/sharer.php?u=https://phatnguoixe.com"
                        type="button" style="border-color: green; color: green;padding:5px 10px;">↑ CHIA SẺ FACEBOOK</a>
                <br />
                <hr />Nguồn <b style="font-weight:550;">'Cổng thông tin điện tử Cục Cảnh sát giao thông'</b><br />Phần
                mềm tra cứu phạt nguội <br />Phiên bản 2025
</center></br>
    `);
console.log(root.querySelectorAll('center h3')[1].text);