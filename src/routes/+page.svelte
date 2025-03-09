<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly, slide } from 'svelte/transition';
  
  // Tab state management
  let selectedTab = $state<'stories' | 'journal' | 'about'>('stories');
  let mounted = $state(false);
  
  // Journal entries state
  let openJournalEntry = $state<string | null>(null);
  let isStoryVisible = $state(false);
  
  // Mount handler
  onMount(() => {
    mounted = true;
  });
  
  function selectTab(tab: 'stories' | 'journal' | 'about') {
    selectedTab = tab;
  }
  
  function toggleJournalEntry(id: string) {
    openJournalEntry = openJournalEntry === id ? null : id;
    
    // If we're opening an entry, scroll it into view after a short delay to allow for animation
    if (openJournalEntry === id) {
      setTimeout(() => {
        const entryElement = document.getElementById(`entry-${id}`);
        if (entryElement) {
          entryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }
  
  function toggleStory() {
    isStoryVisible = !isStoryVisible;
  }
  
  // Journal entries data
  const journalEntries = [
    {
      id: "pure-white",
      title: "Pure white",
      date: "Monday 3 March 2025",
      content: "I'll be the first to say goodbye\nLet's just say\nI'm always to blame\nI have no choice but to move forward\nI was looking for the pure white\nJust roaming around the truth\nThe darkest part was busted up\nI like you, it's true but\nI gotta gotta go, leave you alone\nI like you, I'm not sure tho\nI guess we're at that kind of stage"
    },
    {
      id: "impurity",
      title: "Impurity",
      date: "Sunday 2 March 2025",
      content: "I'm still not good enough\nI want to smile more than you\nI want to look further than you\nthis impurity you gave me grows lonely\ncould I try to run away somewhere,\npreferably somewhere far away?\na journey that didn't need love\nor to return from\nor to end\nI want to walk more than you\nI want to dream more than you\nthis impurity is always in my chest\nI'd rather you not falter,\nand turn me into ash already.\nfrom your point of view,\nthis surely isn't something worth worrying about\njust hurry up and go away\nI willfully resented it, but also willfully got rid of it\nI'll probably be alright now\nbut for now, thank you"
    },
    {
      id: "at-the-mercy-of-my-dreams",
      title: "at the mercy of my dreams",
      date: "Saturday 1 March 2025",
      content: "so we don't get separated\nI run up to you\nwith the burial of my unresolved love\nI look towards tomorrow\nthe times I've made you angry\nby being distracted by another\neven though you pretended not to notice\nif we had follow through\nIt'd surely have been a forbidden love\nwatching until I grew tired\nright now the things I can't touch\nthe things I can't forget\nI continue to count\nthe space between me and you\nand everything I closed my eyes to\nI still like you you know?\nhey are you still there?\nhey"
    },
    {
      id: "a-world-without-a-name",
      title: "without you",
      date: "Friday 28 February 2025",
      content: "A world drained of color, veiled in white.\nTime has stopped, or perhaps it was never moving to begin with.\nThat expression—you never once showed it to me.\nThat distance between us—I found it almost comforting.\nYour laughter,\nthe burdens we carried,\nthey seem so insignificant now.\nYou stained my world in shades I cannot erase.\nMy arms, frozen numb, reach out in vain.\nI wish, with everything I have,\nthat this moment will never end.\nMeaningless things, so many of them.\nAnd yet, I was happy.\nFoolishly, I believed it could go on forever.\nBut in this new world, I wonder—\nis it still possible to laugh without pretense?\nI don't think I exist in the future you imagine.\nI don't want to run away.\nI only want to return to that day.\nCan I say it now?\nOr is it already too late?\nI know one thing for certain—\nI do not want this to end."
    },
    {
      id: "i-cant-love-you",
      title: "I can't love you",
      date: "Thursday 27 February 2025",
      content: "I was meant to be transparent,\nBut now I'm starting to get blurred and cloudy\nbeing entangled with \"you,\" and with you as well,\nI've lost the path forward.\nMy footsteps suddenly went dark\nwords deserted me\nIt seems I'm becoming someone unrecognisable\neven if I were to give a voice to it\nYou wouldn't truly hear.\nWe're not allowed back home\nTo this place ever again, are we?\nEven if all is lost\nEven if someone were to ask you ,\n\"Are you standing face-to-face with your own heart?\"\nwould you then seek to reclaim me?\nIn order to keep these heated emotions from growing cold\nMy determination that dwells there\nBuilding up its purpose, it jumped right out my chest\nBut I know that surely,\nI can no longer love you"
    },
    {
      id: "the-beggar",
      title: "The beggar",
      date: "Wednesday 26 February 2025",
      content: "I wish I could just cut my belly open and let all of the words come spilling out. No matter if it's gibberish, as long as it's my flesh and blood doing the talking."
    },
    {
      id: "hide-and-seek",
      title: "Hide and seek",
      date: "Wednesday 19 February 2025",
      content: "Will nobody come and find me?\nNot here...not here...not here, I'm not here, huh?\neveryone will forget me\nI wave my hand alone, in a coloring book\nI don't know, I don't care\nJust go off somewhere like everyone else\n\"I've found you!\"\nIf you treat me so kindly, I will start crying\nIt hurts...it hurts...it hurts, my heart hurts so badly\nGoodbye"
    },
    {
      id: "its-cringe-really",
      title: "Its cringe really",
      date: "Tuesday 18 February 2025",
      content: "It's another bad day in a bad, bad world.\nIt's going to end soon . I know that.\nSo maybe it's time to leave.\nBut what should I do with all this love?\nThey say you can't take back what you've given.\nA lie. I made it, didn't I? So I can take it back\nThis spell—was it a curse or a blessing? No matter.\nI can't dispel it, nor do I want to"
    },
    {
      id: "throwaway-connections",
      title: "Throwaway connections",
      date: "Tuesday 11 February 2025",
      content: "My throwaway connections,\nAnd relationships that only exist at the right time and the right place\nEven if I try to lament, saying \"something's not quite right\",\nI remain understanding nothing"
    },
    {
      id: "disdain",
      title: "Cracks in my heart",
      date: "Saturday 1 February 2025",
      content: "For every person whose feelings I treat with disdain\nI live relying on an another.\nThe punishment for curling up all those times\nTightens around my chest and digs in its fangs\nCracks run their way through my heart.\nSo it wouldn't break\nSo I wouldn't break it\nEven though with my inexperienced hands, I so tried to protect it\nI ended up straining myself and crushing it"
    },
    {
      id: "so-just-live",
      title: "so just live",
      date: "Thursday 16 January 2025",
      content: "I didn't have it in my nature to care about myself enough to live on\nbut I found reasons to live for and still keep finding more and more to life than what I knew but\nthose reasons keep disappearing\nI'm scared, scared of feeling what I felt, feeling that I wanted to die, having no reason to live\nwhen I want to live and I wanted to live more than anyone in this world.\nthat's why I wanted to die because I wanted to live more than anyone in this world"
    },
    {
      id: "cotton-candy",
      title: "Cotton candy",
      date: "Thursday 9 January 2025",
      content: "as you were melting cotton candy in your mouth.\nYou said to me, the one wishing to be the cotton candy, \"isn't this fun?\"\nbut I'm staring at your face, trying to burn it into my memory.\nWhat should I do about this pain in my chest?\nis it wrong to just be by your side?\nI've ran out of things to say, the only words that are left it me are… even though I knew it\nalready.\nWhat should I do if my thoughts of you overflows?\nWhen is the right chance or the right time to hold your hands?\nLooking at those soft hands of yours, of what strength should I hold them with?"
    },
    {
      id: "a-fragile-doll",
      title: "A fragile doll",
      date: "Wednesday 8 January 2025",
      content: "A fragile beauty, one and only.\nmy dear heart, please, now and forever,\nnever forget her, don't ever change and stay the same,\nmy dear heart so sweet"
    },
    {
      id: "happiness-leaves-an-aftertaste",
      title: "Happiness leaves an aftertaste",
      date: "Sunday 29 December 2024",
      content: "I want to say I don't like you\nbut I can't deny the feelings\nmy heart beats reminds me that it's beating for you\nBy the time I confess to you please don't hurt my feelings for you"
    },
    {
      id: "maybe-im-broken",
      title: "maybe I'm broken",
      date: "Wednesday 25 December 2024",
      content: "The broken things in life are often the most beautiful. Maybe that's why I'm drawn to them."
    },
    {
      id: "smile",
      title: ":)",
      date: "Tuesday 17 December 2024",
      content: "I'm so immature that, within the blink of an eye, I miss the sight of your smile. If that is so, then I rather remain unaware of it to begin with."
    },
    {
      id: "love",
      title: "love",
      date: "Monday 16 December 2024",
      content: "As for love … no, having once written that word I can write nothing more."
    },
    {
      id: "it-was-fun",
      title: "It was fun",
      date: "Sunday 15 December 2024",
      content: "You've treated me nicely, yes, but only because you find me curious and amusing. It's made me feel so lonely, somehow."
    },
    {
      id: "what-are-those-eyes-made-of",
      title: "what are those eyes made of",
      date: "Saturday 14 December 2024",
      content: "when those eyes meet,\nholding hope in that twist\nIt must be an unbearable pain\nBut it's a sight to see"
    },
    {
      id: "is-it-fear",
      title: "Is it fear?",
      date: "Friday 13 December 2024",
      content: "I seem to be deficient in the faculty to love others."
    },
    {
      id: "friend-a",
      title: "Friend A",
      date: "Thursday 12 December 2024",
      content: "Though I have always made it my practice to be pleasant to everybody,\nI have not once actually experienced friendship."
    },
    {
      id: "sunrise-or-the-sunset",
      title: "Sunrise or the sunset",
      date: "Saturday 7 December 2024",
      content: "You looked so much more alluring than usual that I simply just watch"
    },
    {
      id: "break-the-silence",
      title: "Break the silence",
      date: "Tuesday 26 November 2024",
      content: "Tell her I don't know her; say that I don't know her, every time someone else comes round and adores her. Tell her that I want her, I can't say I want her. Don't mean to run around, hide and just ignore her. I won't say nothing, so say something. Say something."
    },
    {
      id: "i-would-risk-it-all",
      title: "I would risk it all",
      date: "Monday 4 November 2024",
      content: "Once you've tasted poison, you might as well savor it to the last bitter drop. What use is there in restraint when ruin already runs through your veins? I would risk it all—even if it destroys me —what could be a worthier end?"
    },
    {
      id: "the-silent-collapse-of-a-heart",
      title: "The silent collapse of a heart",
      date: "Thursday 17 October 2024",
      content: "How selfish of me, indeed, to believe that my wretched heart could bear such feelings without consequence."
    },
    {
      id: "are-you-happy",
      title: "Are you happy?",
      date: "Tuesday 15 October 2024",
      content: "Happiness? Simply a fleeting illusion we chase.\nTo ask if I am happy is to ask if the sky truly knows the weight of its cloud\nI do not know of happiness, only the heavy burden of life"
    },
    {
      id: "the-weight-of-fleeting-things",
      title: "The weight of fleeting things",
      date: "Monday 14 October 2024",
      content: "No matter how mundane, those days were real. They'll turn into memories, sure, but never into lies.\nWe will never become lies, right?"
    }
  ];
</script>

<svelte:head>
  <title>ibuuvai</title>
  <meta name="description" content="A digital narrative exploring existence, isolation, and the search for meaning." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Cutive+Mono&family=Major+Mono+Display&display=swap" rel="stylesheet">
</svelte:head>

<main class="min-h-screen flex flex-col justify-start relative overflow-hidden bg-primary">
  <!-- Background and main container -->
  <div class="flex-1 flex flex-col">
    {#if mounted}
      <div 
        in:fade={{ duration: 1500, delay: 300 }}
        class="absolute inset-0 z-0"
      >
        <div class="absolute inset-0 opacity-90 bg-primary"></div>
        
        <!-- Background glow - positioned to cover the entire page -->
        <div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70rem] h-[70rem] rounded-full blur-[60px] bg-accent/8 opacity-25 pointer-events-none"></div>
      </div>
      
      <!-- Hero Content - Takes full viewport height -->
      <div class="h-screen flex flex-col justify-center items-center relative z-10 pt-0">
        <div
          in:fade={{ duration: 1000, delay: 400 }}
          class="relative max-w-4xl mx-auto"
        >
          <!-- Avatar and Name - No top margin -->
          <div 
            in:fade={{ duration: 1200, delay: 500 }}
            class="flex flex-col items-center justify-center"
          >
            <img 
              src="/images/vai.webp" 
              alt="Creator Avatar" 
              class="w-48 h-48 animate-pulse-subtle mb-4"
            />
            <span class="text-3xl md:text-5xl font-black text-accent animate-text-focus font-handwriting uppercase">VAI Ibuu</span>
            <div class="mt-2 text-center">
              <p class="text-lg text-white font-handwriting uppercase font-bold">
                <span class="animate-typing">My existence isn't known by anybody else</span>
              </p>
            </div>
          </div>
          
          <!-- Keep Out and Warning -->
          <div class="text-center mt-3">
            <div class="relative inline-block">
              <div class="absolute inset-0 bg-[#8B0000]/15 blur-[15px] -m-2 rounded-2xl"></div>
              <h1 
                in:fly={{ y: 50, duration: 1200, delay: 800 }}
                class="relative text-5xl md:text-7xl font-black mb-1 px-4 text-[#8B0000] animate-glitch font-creepy"
              >
                Keep out
              </h1>
            </div>
            
            <div class="relative">
              <p 
                class="text-xl md:text-2xl max-w-xl text-center px-6 mx-auto text-white mt-1 font-handwriting"
              >
                <span class="block animate-slide-up opacity-0" style="animation-delay: 1.4s; animation-fill-mode: forwards;">So that I will not be fooled...</span>
                <span class="block animate-slide-up opacity-0 mt-1" style="animation-delay: 2.0s; animation-fill-mode: forwards;">So that I won't drag you into this—</span>
              </p>
              
              <!-- Stay away with drops -->
              <div class="relative mt-1">
                <div class="opacity-0 animate-slide-up" style="animation-delay: 2.6s; animation-fill-mode: forwards;">
                  <span class="text-[#8B0000] font-bold font-creepy text-xl md:text-2xl animate-red-pulse">stay away</span>
                </div>
                
                <!-- Dots positioned directly below stay away -->
                <div class="absolute w-8 left-1/2 -translate-x-1/2 top-full mt-1 opacity-0" style="animation: fade-in 0.5s ease-out 3.1s forwards;">
                  <div class="relative h-24 w-full">
                    <div class="w-2 h-2 bg-[#8B0000] rounded-full animate-fall absolute left-3 top-0" style="animation-duration: 4s; animation-delay: 0.2s;"></div>
                    <div class="w-1.5 h-1.5 bg-[#8B0000] rounded-full animate-fall absolute left-1 top-0" style="animation-delay: 2.2s; animation-duration: 5s;"></div>
                    <div class="w-1 h-1 bg-[#8B0000] rounded-full animate-fall absolute left-5 top-0" style="animation-delay: 4.2s; animation-duration: 4.5s;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabbed Content Area - Positioned below initial viewport -->
      <div class="relative z-10 min-h-screen pt-16">
        <!-- Tab Navigation -->
        <div class="w-full max-w-3xl mx-auto mb-4 px-6">
          <div class="bg-black/30 backdrop-blur-md border border-accent/20 rounded-xl p-1.5 grid grid-cols-3 gap-1 shadow-lg shadow-accent/5">
            <button 
              onclick={() => selectTab('stories')}
              class="py-3 px-4 text-center rounded-lg transition-all duration-300 font-handwriting relative overflow-hidden {selectedTab === 'stories' 
                ? 'bg-gradient-to-br from-black/80 to-black/60 text-accent font-bold shadow-inner' 
                : 'text-white hover:text-accent hover:bg-black/40'}"
            >
              <span class="relative z-10">Stories</span>
              {#if selectedTab === 'stories'}
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
              {:else}
                <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent group-hover:w-full transition-all duration-500 opacity-0 hover:opacity-100"></div>
              {/if}
            </button>
            <button 
              onclick={() => selectTab('journal')}
              class="py-3 px-4 text-center rounded-lg transition-all duration-300 font-handwriting relative overflow-hidden {selectedTab === 'journal' 
                ? 'bg-gradient-to-br from-black/80 to-black/60 text-accent font-bold shadow-inner' 
                : 'text-white hover:text-accent hover:bg-black/40'}"
            >
              <span class="relative z-10">Journal</span>
              {#if selectedTab === 'journal'}
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
              {:else}
                <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent group-hover:w-full transition-all duration-500 opacity-0 hover:opacity-100"></div>
              {/if}
            </button>
            <button 
              onclick={() => selectTab('about')}
              class="py-3 px-4 text-center rounded-lg transition-all duration-300 font-handwriting relative overflow-hidden {selectedTab === 'about' 
                ? 'bg-gradient-to-br from-black/80 to-black/60 text-accent font-bold shadow-inner' 
                : 'text-white hover:text-accent hover:bg-black/40'}"
            >
              <span class="relative z-10">Me</span>
              {#if selectedTab === 'about'}
                <div class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
              {:else}
                <div class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent group-hover:w-full transition-all duration-500 opacity-0 hover:opacity-100"></div>
              {/if}
            </button>
          </div>
        </div>
        
        <!-- Tab Content -->
        <div class="w-full max-w-3xl mx-auto p-4 px-6">
          {#if selectedTab === 'stories'}
            <div in:fade={{ duration: 300 }} class="text-center">
              <h3 class="text-xl font-handwriting text-accent mb-4">Featured Story</h3>
              <ul class="space-y-3">
                <li class="border-b border-accent/10 pb-2">
                  <button 
                    onclick={toggleStory}
                    class="w-full text-left flex items-center py-2 text-white hover:text-accent transition-colors group relative"
                  >
                    <span class="inline-block w-4 h-4 mr-2 text-xs">
                      {#if isStoryVisible}
                        <span class="text-accent">▼</span>
                      {:else}
                        <span class="text-white/50 group-hover:text-accent/70">▶</span>
                      {/if}
                    </span>
                    <span class="font-handwriting text-base group-hover:text-accent transition-colors {isStoryVisible ? 'text-accent' : ''}">Nontitled</span>
                    <span class="text-xs text-white ml-2">2023</span>
                  </button>
                  
                  {#if isStoryVisible}
                    <div 
                      in:slide={{ duration: 300 }} 
                      class="mt-3 border-l-2 border-accent/20 pl-4 text-white font-handwriting text-sm text-left whitespace-pre-line leading-relaxed pr-2"
                    >
                      <p>Loneliness and love are foreign concepts, distant and incomprehensible, our human forms already cast aside, discarded long ago. Proof of existence is reduced to empty words, scattered meaningless across a cramped, suffocating stage. We are performers without an audience, each desperately acting out our roles, running breathlessly towards the end credits, even though the seats remain vacant.</p>
                      
                      <p class="mt-2">The person I once recognized as myself is no longer here, lost somewhere beyond memory. I can't recall a single part I was suited to play. Now, the encore has arrived—surely, we are all holding our breath, waiting for the dramatic twist. Yet, what do those eyes of yours see? There was a time when we were innocent, untouched; but before we realized it, we had turned into monsters.</p>
                      
                      <p class="mt-2">Without warning, I became nothing more than a side character, my voice lost amidst overwhelming noise. Everyone around desperately shields themselves, secretly yearning for a savior's hand to appear. Alone, I shed tears, unable to find the truths I had carefully hidden. Looking back, hadn't I discarded every emotion? Yet, the tears still flowed inexplicably. Warmth and kindness seem suspicious now, every offered hand is mistrusted. Love seeps slowly from the wound in my heart, and your gaze threatens my collapse. How pitiful I must appear, caught dancing precariously between love and hatred.</p>
                      
                      <p class="mt-2">Enough—I long for ignorance now. Words have become meaningless.</p>
                      
                      <div class="my-4 px-4 py-2 border-l-4 border-accent/30 bg-black/20 italic">
                        "Hey, let's run away to somewhere far away—a place that's not here."
                      </div>

                      <p class="mt-2">A place where the morning dawn gently spills through the wooden cracks, illuminating a forgotten path once caressed by winds beneath an eternal springtime sky. A place free of scripts, devoid of lines or directors, where every moment is fleeting, impossible to retake. A world beyond the frame of any camera, a reality untouched even by the widest of lenses. In this hidden place, we could taste suspiciously bright fruits without fear of judgment.</p>
                      
                      <p class="mt-2">No one would cry for us. The title flashing across the screen just before the end—a story unremembered, incredibly ordinary. This title, abandoned like refuse, without even the dignity of a name, belongs solely to you and me.</p>
                    </div>
                  {/if}
                </li>
              </ul>
            </div>
          {:else if selectedTab === 'journal'}
            <div in:fade={{ duration: 300 }}>
              <h3 class="text-xl font-handwriting text-accent mb-4 text-center">Recent Entries</h3>
              <ul class="space-y-4">
                {#each journalEntries as entry}
                  <li class="border-b border-accent/10 pb-3" id="entry-{entry.id}">
                    <button 
                      onclick={() => toggleJournalEntry(entry.id)}
                      class="w-full text-left flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 text-white hover:text-accent transition-colors group relative"
                    >
                      <div class="flex items-center">
                        <span class="inline-block w-4 h-4 mr-2 text-xs">
                          {#if openJournalEntry === entry.id}
                            <span class="text-accent">▼</span>
                          {:else}
                            <span class="text-white/50 group-hover:text-accent/70">▶</span>
                          {/if}
                        </span>
                        <span class="font-handwriting text-base group-hover:text-accent transition-colors {openJournalEntry === entry.id ? 'text-accent' : ''}">{entry.title}</span>
                      </div>
                      <span class="text-xs text-white/70 italic mt-1 sm:mt-0">{entry.date}</span>
                    </button>
                    
                    {#if openJournalEntry === entry.id}
                      <div 
                        in:slide={{ duration: 300 }} 
                        class="mt-3 border-l-2 border-accent/20 pl-4 text-white font-handwriting text-sm text-left whitespace-pre-line leading-relaxed pr-2"
                      >
                        {entry.content}
                      </div>
                    {/if}
                  </li>
                {/each}
              </ul>
            </div>
          {:else if selectedTab === 'about'}
            <div in:fade={{ duration: 300 }} class="flex flex-col gap-4 items-center">
              <a 
                href="https://instagram.com/ibuu.vai" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white font-handwriting flex items-center gap-2 hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 relative z-20 cursor-pointer w-fit"
                aria-label="Instagram profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-instagram" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                @ibuu.vai
              </a>
              
              <a 
                href="https://open.spotify.com/user/nmjob8wgvxy31yim5oaztszew" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-700 rounded-full text-white font-handwriting flex items-center gap-2 hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 relative z-20 cursor-pointer w-fit"
                aria-label="Spotify profile"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                vai
              </a>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</main>
