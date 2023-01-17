<template>
    <div class="not-found-div">
        <svg width="380px" height="500px" viewBox="0 0 837 1045" version="1.1"
             xmlns="http://www.w3.org/2000/svg"
             xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none"
               fill-rule="evenodd" sketch:type="MSPage">

                <circle id="Polygon-1" cx="300" cy="280" r="300"
                        stroke="#007FB2" stroke-width="6" xfill="#28a745" />
                <path id="Polygon-2"
                      d="M78.5,529 L147,569.186414 L147,648.311216 L78.5,687 L10,648.311216 L10,569.186414 L78.5,529 Z"
                      stroke="#EF4A5B" stroke-width="6" sketch:type="MSShapeGroup" />
                <path id="Polygon-3"
                      d="M773,186 L827,217.538705 L827,279.636651 L773,310 L719,279.636651 L719,217.538705 L773,186 Z"
                      stroke="#795D9C" stroke-width="6" sketch:type="MSShapeGroup" />
                <path id="Polygon-4"
                      d="M639,529 L773,607.846761 L773,763.091627 L639,839 L505,763.091627 L505,607.846761 L639,529 Z"
                      stroke="#F2773F" stroke-width="6" sketch:type="MSShapeGroup" />
                <path id="Polygon-5"
                      d="M281,801 L383,861.025276 L383,979.21169 L281,1037 L179,979.21169 L179,861.025276 L281,801 Z"
                      stroke="#36B455" stroke-width="6" sketch:type="MSShapeGroup" />
            </g>
        </svg>
        <div class="message-box">
            <h1>404</h1>
            <p>{{$t('titles.pageNotFound')}}</p>
            <div>
                <router-link :to="{name: 'home'}" class="btn btn-primary btn-sm">
                    {{$t('actions.back')}}
                </router-link>
            </div>
        </div>
    </div>
</template>
export default {
}
<style scoped>
    svg {
        position: absolute;
        top: 20%;
        left: 50%;
        margin-left: -400px;
    }

    .not-found-div {
        height: 85vh;
    }

    .message-box {
        height: 85vh;
        width: 380px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -100px;
        margin-left: 50px;
        font-family: Roboto;
        font-weight: 300;
    }

    .message-box h1 {
        font-size: 60px;
        line-height: 46px;
        margin-bottom: 40px;
    }

    #Polygon-1,
    #Polygon-2,
    #Polygon-3,
    #Polygon-4,
    #Polygon-4,
    #Polygon-5 {
        animation: float 1s infinite ease-in-out alternate;
    }

    #Polygon-2 {
        animation-delay: .2s;
    }

    #Polygon-3 {
        animation-delay: .4s;
    }

    #Polygon-4 {
        animation-delay: .6s;
    }

    #Polygon-5 {
        animation-delay: .8s;
    }

    @keyframes float {
        100% {
            transform: translateY(20px);
        }
    }

    @media (max-width: 450px) {
        svg {
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -250px;
            margin-left: -190px;
        }

        .message-box {
            top: 50%;
            left: 50%;
            margin-top: -100px;
            margin-left: -190px;
            text-align: center;
        }
    }
</style>