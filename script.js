{\rtf1\ansi\ansicpg1252\cocoartf2868
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 function toggleSection(section) \{\
    section.classList.toggle('active');\
\}\
\
function openLightbox(videoSrc) \{\
    const lightbox = document.getElementById('lightbox');\
    const video = document.getElementById('lightbox-video');\
    video.src = videoSrc;\
    lightbox.style.display = 'flex';\
    video.play();\
\}\
\
function closeLightbox() \{\
    const lightbox = document.getElementById('lightbox');\
    const video = document.getElementById('lightbox-video');\
    lightbox.style.display = 'none';\
    video.pause();\
    video.src = "";\
\}\
\
// Hover play per i video piccoli\
document.querySelectorAll('.video-card video').forEach(v => \{\
    v.addEventListener('mouseenter', () => v.play());\
    v.addEventListener('mouseleave', () => \{ v.pause(); v.currentTime = 0; \});\
\});}