if (jQuery){
    (function($){


        $.memoryGame = function(){

        }

        $.memoryGame.data = {
            firstSelected: null,
            secondSelected: null,
            timeout: 750,
            moves: 0,
            completed: false,
            startTime: 0,
            intervalId: null
        };

        $.memoryGame.init = function(){
            $('div.memoryGame').each(function(){
                init($(this), arguments);
            });
        }

        $.memoryGame.data.cover = "images/cover.png";

        $.memoryGame.images = [
            "images/backpack.png",
            "images/boat.png",
            "images/dinosaur.png",
            "images/home.png",
            "images/hourglass.png",
            "images/map.png",
            "images/officer.png",
            "images/paint.png",
            "images/penguin.png",
            "images/people.png",
            "images/run.png",
            "images/toys.png"
        ];

        function shuffle(ary){
            idx = ary.length - 1;

            while(idx > 0){
                jdx = parseInt(Math.random() * 10)
                tmp = ary[idx];
                ary[idx] = ary[jdx]
                ary[jdx] = tmp;
                idx--;
            }
        }

        function init($div, options){
            var idx = 0, jdx = 0; var tmp;

            $div.empty();
            $.memoryGame.data.moves = 0;
            $.memoryGame.data.startTime = new Date();

            var $board = $('<div />').addClass('memoryGameBoard').appendTo($div);

            $("<div />").addClass('clear').appendTo($div);
            var $stat =$('<div />').addClass('memoryGameStats').appendTo($div);

            var $movesStat = $('<div />').addClass("memoryGameMovesStat memoryGameStat");
            $('<span />').addClass('memoryGameMovesLabel  memoryGameStatLabel').text('Moves').appendTo($movesStat);
            $('<span />').addClass('memoryGameMovesData').text($.memoryGame.data.moves).appendTo($movesStat);
            $movesStat.appendTo($stat);


            var $timeStat = $('<div />').addClass("memoryGameTimeStat memoryGameStat");
            $('<span />').addClass('memoryGameTimeLabel memoryGameStatLabel').text('Time').appendTo($timeStat);
            $('<span />').addClass('memoryGameTimeData').text("0:00").appendTo($timeStat);
            $timeStat.appendTo($stat);

            $.memoryGame.data.intervalId = setInterval(updateTime, 1000);

            ary = [];
            for(idx = 0 ; idx < 12; idx++){
                ary.push(idx);
                ary.push(idx);
            }

            for (idx = 0 ; idx < 3; idx++){
                shuffle(ary);
            }


            console.debug($div);
            var idx = 0;
            var $cardPosition;

            for (idx = 0; idx < ary.length; idx++){
                $cardPosition = $('<div />').addClass('cardPosition');
                $cardPosition.appendTo($board);

                $img = $('<img />').attr({'data-src': $.memoryGame.images[ary[idx]], src: $.memoryGame.data.cover});
                $img.appendTo($cardPosition);

                $cardPosition.bind('click', selectCard);
            }
        }

        function updateTime(){
            var now = new Date();
            var delta = parseInt((now.valueOf() - $.memoryGame.data.startTime ) / 1000);
            var min = parseInt(delta / 60);
            var sec = delta % 60;

            sec = sec < 10 ? "0" + sec : sec;
            $('.memoryGameTimeData').text(min + ":" + sec);

        }

        function endGame(){
            clearInterval($.memoryGame.data.intervalId);
        }

        function selectCard(evt){
            var target = evt.currentTarget;
            var $img = $('img', target);

            if ($img.data('matched') || $.memoryGame.data.secondSelected){
                return;
            }

            $img.attr('src', $img.attr('data-src'));

            if (!$.memoryGame.data.firstSelected){
                $.memoryGame.data.firstSelected = $img;
            }
            else {
               var $first = $.memoryGame.data.firstSelected;

               if($first.attr('data-src') === $img.attr('data-src')){
                    $first.data('matched', true);
                    $img.data('matched', true);
                    $.memoryGame.data.firstSelected = null;

                   if ($('.memoryGame img[src="' + $.memoryGame.data.cover + '"]').length == 0){
                       endGame();
                   }
               }
               else {
                   $.memoryGame.data.secondSelected = $img;
                   setTimeout(deSelectCard, $.memoryGame.data.timeout)
               }

               $.memoryGame.data.moves += 1;
               updateStats();
            }
        }

        function updateStats(){
            $('.memoryGameMovesData').text($.memoryGame.data.moves);
        }

        function deSelectCard(){
            $.memoryGame.data.firstSelected.attr('src', $.memoryGame.data.cover);
            $.memoryGame.data.firstSelected = null;
            $.memoryGame.data.secondSelected.attr('src', $.memoryGame.data.cover);
            $.memoryGame.data.secondSelected = null;
        }

        $(document).ready(function(){
            $.memoryGame.init();
        });

    })(jQuery);
}