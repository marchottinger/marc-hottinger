**resizer vidéo**
ffmpeg -i input.mov -filter:v scale=1488:-1 -c:a copy output.mov
**ajouter cadre noir**
ffmpeg -i output.mov -filter_complex "[0]pad=w=1600:h=1200:x=56:y=100:color=black" output-frame.mov
**overlay image**
ffmpeg -i output-frame.mov -i input.png -filter_complex "[0:v][1:v] overlay=(1200-1200)/2:(1600-1600)/2:enable='between(t,0,20)'" -pix_fmt yuv420p -c:a copy output-overlay.mp4


**test 1**
ffmpeg \
    -i output.mov -i ryoko.png \
    -filter_complex \
       "[0:v]pad=w=1600:h=1200:x=56:y=100:color=black[frame]; \
        [frame][1:v]overlay=(1200-1200)/2:(1600-1600)/2:enable='between(t,0,20)'[out]" \
    -map "[out]" \
    -pix_fmt yuv420p -c:a copy output-overlay-test.mp4

**test 2**
ffmpeg \
    -i input.mov -i overlay.png \
    -filter_complex \
       "[0:v]scale=1488:-1[scaled]; \
        [scaled]pad=w=1600:h=1200:x=56:y=100:color=black[frame]; \
        [frame][1:v]overlay=(1200-1200)/2:(1600-1600)/2:enable='between(t,0,20)'[out]" \
    -map "[out]" \
    -pix_fmt yuv420p -c:a copy output.mp4


**exemples**
ffmpeg -i input -vf [in]yadif=0:0:0[middle];[middle]scale=iw/2:-1[out] output

ffmpeg -i input.mpg -vf "movie=watermark.png [logo]; [in][logo] overlay=W-w-10:H-h-10, fade=in:0:20 [out]" output.mpgtestit