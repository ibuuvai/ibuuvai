<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';
	import CommandPalette from '$lib/components/CommandPalette.svelte';

	// Tab state management
	let selectedTab = $state<'stories' | 'journal' | 'about' | 'book'>('about');
	let mounted = $state(false);
	let currentChapter = $state(0);
	let bookProgress = $state(0);
	let lastChapter = $state(0);
	// removed unused: turnDirection

	// Journal entries state
	let openJournalEntry = $state<string | null>(null);
	let isStoryVisible = $state(false);

	// removed unused: typingAnimationDuration

	// Cursor parallax state (CSS variables driven)
	let enableMotion = $state(true);

	// Mount handler
	onMount(() => {
		mounted = true;

		// Open journal entry from URL hash and switch to journal tab if applicable
		const openFromHash = () => {
			const id = location.hash.replace(/^#/, '');
			if (!id) return;
			const exists = journalEntries.some((e) => e.id === id);
			if (exists) {
				selectedTab = 'journal';
				openJournalEntry = id;
				setTimeout(() => {
					const entryElement = document.getElementById(`entry-${id}`);
					entryElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}, 50);
			}
		};

		openFromHash();
		const onHash = () => openFromHash();
		window.addEventListener('hashchange', onHash);

		// Scroll reveal animations for elements marked with [data-reveal]
		const io = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						entry.target.classList.add('animate-slide-up');
						io.unobserve(entry.target);
					}
				}
			},
			{ root: null, threshold: 0.15 }
		);
		Array.from(document.querySelectorAll('[data-reveal]')).forEach((el) => io.observe(el));

		// Reduced motion check
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
		enableMotion = !prefersReduced.matches;
		const onReducedChange = () => (enableMotion = !prefersReduced.matches);
		prefersReduced.addEventListener?.('change', onReducedChange);

		// Cursor parallax: update CSS variables --mx/--my (normalized) and --cursor-x/--cursor-y (px)
		const onMouseMove = (e: MouseEvent) => {
			if (!enableMotion) return;
			const cx = window.innerWidth / 2;
			const cy = window.innerHeight / 2;
			const mx = (e.clientX - cx) / cx; // -1..1
			const my = (e.clientY - cy) / cy; // -1..1
			document.documentElement.style.setProperty('--mx', String(mx));
			document.documentElement.style.setProperty('--my', String(my));
			document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
			document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
		};
		window.addEventListener('mousemove', onMouseMove, { passive: true });

		function clamp(n: number, min: number, max: number) {
			return Math.max(min, Math.min(max, n));
		}

		function updateBookProgress() {
			const container = document.querySelector('.book-container .chapter-content') as HTMLElement | null;
			if (!container) {
				bookProgress = 0;
				return;
			}
			const elTop = container.getBoundingClientRect().top + window.scrollY;
			const elHeight = container.offsetHeight;
			const viewport = window.innerHeight;
			const maxScroll = Math.max(1, elHeight - viewport);
			const raw = (window.scrollY - elTop) / maxScroll;
			bookProgress = clamp(raw, 0, 1);
		}

		const onScroll = () => updateBookProgress();
		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		updateBookProgress();

		return () => {
			window.removeEventListener('hashchange', onHash);
			window.removeEventListener('scroll', onScroll as EventListener);
			window.removeEventListener('resize', onScroll as EventListener);
			window.removeEventListener('mousemove', onMouseMove as EventListener);
			io.disconnect();
		};
	});

	$effect(() => {
		// Trigger progress update when switching to book or changing chapter
		selectedTab;
		currentChapter;
		setTimeout(() => {
			if (selectedTab === 'book') {
				const container = document.querySelector('.book-container .chapter-content');
				if (container) {
					bookProgress = 0;
					// delay to allow layout to settle
					setTimeout(() => {
						const evt = new Event('scroll');
						window.dispatchEvent(evt);
					}, 0);
				}
			}
		}, 0);

		if (currentChapter !== lastChapter) {
			lastChapter = currentChapter;
		}
	});

	function selectTab(tab: 'stories' | 'journal' | 'about' | 'book') {
		const apply = () => {
			selectedTab = tab;
			if (tab !== 'journal' && typeof window !== 'undefined' && location.hash) {
				try { history.replaceState(null, '', location.pathname + location.search); } catch {}
			}
		};
		if (document.startViewTransition) {
			document.startViewTransition(apply);
		} else {
			apply();
		}
	}

	function navigateToTab(tab: 'stories' | 'journal' | 'about' | 'book') {
		selectTab(tab);
	}

	function openJournalFromPalette(id: string) {
		selectedTab = 'journal';
		openJournalEntry = id;
		setTimeout(() => {
			const entryElement = document.getElementById(`entry-${id}`);
			entryElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}, 50);
	}

	function toggleJournalEntry(id: string) {
		const next = openJournalEntry === id ? null : id;
		openJournalEntry = next;
		// Update hash without causing jump when closing
		if (next) {
			location.hash = `#${id}`;
			setTimeout(() => {
				const entryElement = document.getElementById(`entry-${id}`);
				entryElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 50);
		} else if (location.hash === `#${id}`) {
			history.replaceState(null, '', location.pathname + location.search);
		}
	}

	function toggleStory() {
		isStoryVisible = !isStoryVisible;
	}

	// Journal entries data
	const journalEntries = [
		{
			id: 'a-letter-that-will-never-reach-you',
			title: 'a letter that will never reach you',
			date: 'Wednesday 26 March 2025',
			content:
				'For example, if this letter were to disappear, the world would remain unchanged.\n\nWe, the smallest of people, should be more hopeful than we were yesterday. That is what I would like to believe. But you, scraping together sadness, dreams, love—stuffing them into that fragile box you called a heart—was that really hope? The world you painted became my reason for living, or so I told myself. The city was calm, as if it had never known your struggle.\n\nIf this letter reaches you, does that alone give it meaning? You would probably laugh and call it nonsense. This space you fought to carve out, this place where you clung to existence—I do not know if I can preserve it in your absence. I do not know if anyone can. But I will say this: rest in peace, if such a thing is possible. If ever the day comes when you grant yourself permission to disappear, I will not stop you.\n\nIf I could save people by making a mockery of myself, I would play the fool gladly. What comes first, money or boredom? Does it even matter? Who does this voice reach? Maybe no one. Maybe we are all just wandering in the dark, grasping for something just beyond our fingertips. A little closer, and I would have caught it. But it slipped away.\n\nStill, I remain, as I am. If you could see me now, what would you think? Would you laugh? Would you scold me for still being here? Live, survive—how long do we have to keep doing this? I hope these words reach you someday, even if they are selfish, even if they last no longer than a sigh.\n\nEven if the world changes, the life you painted remains. And if I must remain here a little longer, I will. Until then, keep going.'
		},
		{
			id: 'melancholy',
			title: 'Melancholy',
			date: 'Thursday 20 March 2025',
			content:
				"Nothing is going the right way anymore.\nAnother ordinary day begins.\nWatching the day as it withers by.\n\nTomorrow has come by again today.\nEven if I lie, tomorrow will still come.\nEven if I do nothing, the sun will still rise.\nIt's all the same.\n\nThe days I've taken for granted—\nThey let me know that they're ending again today.\n\nWaiting, searching—\nFor something.\nSomething that will never cease to shine.\nI want to keep searching for that light.\nI want hope for tomorrow.\n\nI'm fine with just a tiny little bit of happiness.\n\nI regret that.\n\nMaybe today,\nI'll be able to change something.\nI'll keep believing that.\n\nI'll keep living like this.\n\nTomorrow too."
		},
		{
			id: 'pure-white',
			title: 'Pure white',
			date: 'Monday 3 March 2025',
			content:
				"I'll be the first to say goodbye\nLet's just say\nI'm always to blame\nI have no choice but to move forward\nI was looking for the pure white\nJust roaming around the truth\nThe darkest part was busted up\nI like you, it's true but\nI gotta gotta go, leave you alone\nI like you, I'm not sure tho\nI guess we're at that kind of stage"
		},
		{
			id: 'impurity',
			title: 'Impurity',
			date: 'Sunday 2 March 2025',
			content:
				"I'm still not good enough\nI want to smile more than you\nI want to look further than you\nthis impurity you gave me grows lonely\ncould I try to run away somewhere,\npreferably somewhere far away?\na journey that didn't need love\nor to return from\nor to end\nI want to walk more than you\nI want to dream more than you\nthis impurity is always in my chest\nI'd rather you not falter,\nand turn me into ash already.\nfrom your point of view,\nthis surely isn't something worth worrying about\njust hurry up and go away\nI willfully resented it, but also willfully got rid of it\nI'll probably be alright now\nbut for now, thank you"
		},
		{
			id: 'at-the-mercy-of-my-dreams',
			title: 'at the mercy of my dreams',
			date: 'Saturday 1 March 2025',
			content:
				"so we don't get separated\nI run up to you\nwith the burial of my unresolved love\nI look towards tomorrow\nthe times I've made you angry\nby being distracted by another\neven though you pretended not to notice\nif we had follow through\nIt'd surely have been a forbidden love\nwatching until I grew tired\nright now the things I can't touch\nthe things I can't forget\nI continue to count\nthe space between me and you\nand everything I closed my eyes to\nI still like you you know?\nhey are you still there?\nhey"
		},
		{
			id: 'a-world-without-a-name',
			title: 'without you',
			date: 'Friday 28 February 2025',
			content:
				"A world drained of color, veiled in white.\nTime has stopped, or perhaps it was never moving to begin with.\nThat expression—you never once showed it to me.\nThat distance between us—I found it almost comforting.\nYour laughter,\nthe burdens we carried,\nthey seem so insignificant now.\nYou stained my world in shades I cannot erase.\nMy arms, frozen numb, reach out in vain.\nI wish, with everything I have,\nthat this moment will never end.\nMeaningless things, so many of them.\nAnd yet, I was happy.\nFoolishly, I believed it could go on forever.\nBut in this new world, I wonder—\nis it still possible to laugh without pretense?\nI don't think I exist in the future you imagine.\nI don't want to run away.\nI only want to return to that day.\nCan I say it now?\nOr is it already too late?\nI know one thing for certain—\nI do not want this to end."
		},
		{
			id: 'i-cant-love-you',
			title: "I can't love you",
			date: 'Thursday 27 February 2025',
			content:
				"I was meant to be transparent,\nBut now I'm starting to get blurred and cloudy\nbeing entangled with \"you,\" and with you as well,\nI've lost the path forward.\nMy footsteps suddenly went dark\nwords deserted me\nIt seems I'm becoming someone unrecognisable\neven if I were to give a voice to it\nYou wouldn't truly hear.\nWe're not allowed back home\nTo this place ever again, are we?\nEven if all is lost\nEven if someone were to ask you ,\n\"Are you standing face-to-face with your own heart?\"\nwould you then seek to reclaim me?\nIn order to keep these heated emotions from growing cold\nMy determination that dwells there\nBuilding up its purpose, it jumped right out my chest\nBut I know that surely,\nI can no longer love you"
		},
		{
			id: 'the-beggar',
			title: 'The beggar',
			date: 'Wednesday 26 February 2025',
			content:
				"I wish I could just cut my belly open and let all of the words come spilling out. No matter if it's gibberish, as long as it's my flesh and blood doing the talking."
		},
		{
			id: 'hide-and-seek',
			title: 'Hide and seek',
			date: 'Wednesday 19 February 2025',
			content:
				"Will nobody come and find me?\nNot here...not here...not here, I'm not here, huh?\neveryone will forget me\nI wave my hand alone, in a coloring book\nI don't know, I don't care\nJust go off somewhere like everyone else\n\"I've found you!\"\nIf you treat me so kindly, I will start crying\nIt hurts...it hurts...it hurts, my heart hurts so badly\nGoodbye"
		},
		{
			id: 'its-cringe-really',
			title: 'Its cringe really',
			date: 'Tuesday 18 February 2025',
			content:
				"It's another bad day in a bad, bad world.\nIt's going to end soon . I know that.\nSo maybe it's time to leave.\nBut what should I do with all this love?\nThey say you can't take back what you've given.\nA lie. I made it, didn't I? So I can take it back\nThis spell—was it a curse or a blessing? No matter.\nI can't dispel it, nor do I want to"
		},
		{
			id: 'throwaway-connections',
			title: 'Throwaway connections',
			date: 'Tuesday 11 February 2025',
			content:
				'My throwaway connections,\nAnd relationships that only exist at the right time and the right place\nEven if I try to lament, saying "something\'s not quite right",\nI remain understanding nothing'
		},
		{
			id: 'disdain',
			title: 'Cracks in my heart',
			date: 'Saturday 1 February 2025',
			content:
				"For every person whose feelings I treat with disdain\nI live relying on another.\nThe punishment for curling up all those times\nTightens around my chest and digs in its fangs\nCracks run their way through my heart.\nSo it wouldn't break\nSo I wouldn't break it\nEven though with my inexperienced hands, I so tried to protect it\nI ended up straining myself and crushing it"
		},
		{
			id: 'so-just-live',
			title: 'so just live',
			date: 'Thursday 16 January 2025',
			content:
				"I didn't have it in my nature to care about myself enough to live on\nbut I found reasons to live for and still keep finding more and more to life than what I knew but\nthose reasons keep disappearing\nI'm scared, scared of feeling what I felt, feeling that I wanted to die, having no reason to live\nwhen I want to live and I wanted to live more than anyone in this world.\nthat's why I wanted to die because I wanted to live more than anyone in this world"
		},
		{
			id: 'cotton-candy',
			title: 'Cotton candy',
			date: 'Thursday 9 January 2025',
			content:
				"as you were melting cotton candy in your mouth.\nYou said to me, the one wishing to be the cotton candy, \"isn't this fun?\"\nbut I'm staring at your face, trying to burn it into my memory.\nWhat should I do about this pain in my chest?\nis it wrong to just be by your side?\nI've ran out of things to say, the only words that are left it me are… even though I knew it\nalready.\nWhat should I do if my thoughts of you overflows?\nWhen is the right chance or the right time to hold your hands?\nLooking at those soft hands of yours, of what strength should I hold them with?"
		},
		{
			id: 'a-fragile-doll',
			title: 'A fragile doll',
			date: 'Wednesday 8 January 2025',
			content:
				"A fragile beauty, one and only.\nmy dear heart, please, now and forever,\nnever forget her, don't ever change and stay the same,\nmy dear heart so sweet"
		},
		{
			id: 'happiness-leaves-an-aftertaste',
			title: 'Happiness leaves an aftertaste',
			date: 'Sunday 29 December 2024',
			content:
				"I want to say I don't like you\nbut I can't deny the feelings\nmy heart beats reminds me that it's beating for you\nBy the time I confess to you please don't hurt my feelings for you"
		},
		{
			id: 'maybe-im-broken',
			title: "maybe I'm broken",
			date: 'Wednesday 25 December 2024',
			content:
				"The broken things in life are often the most beautiful. Maybe that's why I'm drawn to them."
		},
		{
			id: 'smile',
			title: ':)',
			date: 'Tuesday 17 December 2024',
			content:
				"I'm so immature that, within the blink of an eye, I miss the sight of your smile. If that is so, then I rather remain unaware of it to begin with."
		},
		{
			id: 'love',
			title: 'love',
			date: 'Monday 16 December 2024',
			content: 'As for love … no, having once written that word I can write nothing more.'
		},
		{
			id: 'it-was-fun',
			title: 'It was fun',
			date: 'Sunday 15 December 2024',
			content:
				"You've treated me nicely, yes, but only because you find me curious and amusing. It's made me feel so lonely, somehow."
		},
		{
			id: 'what-are-those-eyes-made-of',
			title: 'what are those eyes made of',
			date: 'Saturday 14 December 2024',
			content:
				"when those eyes meet,\nholding hope in that twist\nIt must be an unbearable pain\nBut it's a sight to see"
		},
		{
			id: 'is-it-fear',
			title: 'Is it fear?',
			date: 'Friday 13 December 2024',
			content: 'I seem to be deficient in the faculty to love others.'
		},
		{
			id: 'friend-a',
			title: 'Friend A',
			date: 'Thursday 12 December 2024',
			content:
				'Though I have always made it my practice to be pleasant to everybody,\nI have not once actually experienced friendship.'
		},
		{
			id: 'sunrise-or-the-sunset',
			title: 'Sunrise or the sunset',
			date: 'Saturday 7 December 2024',
			content: 'You looked so much more alluring than usual that I simply just watch'
		},
		{
			id: 'break-the-silence',
			title: 'Break the silence',
			date: 'Tuesday 26 November 2024',
			content:
				"Tell her I don't know her; say that I don't know her, every time someone else comes round and adores her. Tell her that I want her, I can't say I want her. Don't mean to run around, hide and just ignore her. I won't say nothing, so say something. Say something."
		},
		{
			id: 'i-would-risk-it-all',
			title: 'I would risk it all',
			date: 'Monday 4 November 2024',
			content:
				"Once you've tasted poison, you might as well savor it to the last bitter drop. What use is there in restraint when ruin already runs through your veins? I would risk it all—even if it destroys me —what could be a worthier end?"
		},
		{
			id: 'the-silent-collapse-of-a-heart',
			title: 'The silent collapse of a heart',
			date: 'Thursday 17 October 2024',
			content:
				'How selfish of me, indeed, to believe that my wretched heart could bear such feelings without consequence.'
		},
		{
			id: 'are-you-happy',
			title: 'Are you happy?',
			date: 'Tuesday 15 October 2024',
			content:
				'Happiness? Simply a fleeting illusion we chase.\nTo ask if I am happy is to ask if the sky truly knows the weight of its cloud\nI do not know of happiness, only the heavy burden of life'
		},
		{
			id: 'the-weight-of-fleeting-things',
			title: 'The weight of fleeting things',
			date: 'Monday 14 October 2024',
			content:
				"No matter how mundane, those days were real. They'll turn into memories, sure, but never into lies.\nWe will never become lies, right?"
		}
	];

	// Book content
	const bookChapters = [
		{
			title: 'Prologue',
			content: `"I killed someone yesterday," you whispered, words barely audible beneath the soft, persistent rhythm of the rain. Standing drenched at my doorstep, your fragile figure was a silent plea for comfort—an unspoken yearning for reassurance. Rain streamed down your cheeks, blending seamlessly with the quiet grief etched upon your face.

The summer night had turned unexpectedly cold, yet it wasn't the chill making you tremble; it was something deeper, a fear that clung tighter than any storm. Your eyes sought mine briefly, searching desperately for solace, a lifeline that I, uncertain and startled, failed to provide.

"Someone from school," your voice wavered, each word fragile yet heavy with despair, "someone who tormented me endlessly. I didn't mean for it to happen. All I wanted was peace. But now, everything is lost."

Your confession lingered in the air, heavy and pleading, as if you were hoping I'd tell you that nothing was your fault—that everything could still be alright. But my thoughts tangled in confusion, my mind overwhelmed by shock and fear. I struggled to find the words you desperately needed to hear.

"I'll leave," you finally murmured, resignation creeping into your voice. "I'll disappear somewhere far away, somewhere no one will find me."

I stood silent, unable to offer you the simple comfort you craved. Instead, driven by my own uncertainty, I echoed your despair, pushing us both deeper into the darkness you had sought to escape.

"Then let me go with you," I said quietly, not realizing until later that I had merely reinforced your resolve instead of easing it.

Our eyes met again, yours briefly flickering with sadness, recognizing the absence of reassurance in my words. And thus, in mutual silence, beneath the unrelenting rain, we stepped forward into a summer that would saturate my heart with everlasting regret.`
		},
		{
			title: 'Chapter 1: Flight from Reality',
			content: `Our escape began quietly, each of us hurriedly preparing alone, gathering fragments of our separate lives into single, worn bags—essentials reduced to mere tokens of survival. In my bag, I packed a few clothes, some money I'd saved, a small knife whose presence felt heavy with implication, and an old handheld game console, a faint reminder of simpler days. You appeared shortly after, standing silently beneath the muted glow of the streetlamp, clutching your own small bag filled with similar items—clothes, a bit of cash, and personal things whose meaning I could only guess at, including a worn notebook whose edges were frayed from constant use.

Neither of us spoke as we stepped into the darkness outside, oppressive and thick, softened only by the lingering drizzle of summer rain. It felt surreal leaving behind homes we'd known separately yet equally well, now rendered unfamiliar, like remnants of dreams slipping rapidly from memory. The streets, usually comforting in their quiet familiarity, seemed strangely alien, reflecting our inner emptiness.

We moved swiftly, our footsteps quiet and hurried, each step further from familiarity bringing both liberation and anxiety. I stole glances at you, searching your expression for reassurance or perhaps hesitation, but found only quiet resignation and determination. The weight of our unspoken thoughts hung heavily between us, fragile and undisturbed by words.

Rain continued its relentless descent, washing over us, seemingly attempting to erase the past we both sought to escape. Deep within, guilt gnawed at my conscience; I realized, with a silent ache, that I'd failed to comfort you. Instead, I'd unintentionally reinforced your despair, plunging us both deeper into this uncertain reality.

In the distance, thunder murmured gently, and cicadas whispered softly through the trees, emphasizing the height of summer. The sky overhead darkened slightly, hinting at storms still unseen. As we moved forward into uncertainty, I couldn't help but wonder if we'd truly escaped, or merely exchanged one pain for another. And thus, our journey began—a killer and a useless person stepping into the unknown together.`
		},
		{
			title: 'Chapter 2: A World for Two',
			content: `We wandered aimlessly along rural roads, leaving behind the lights of our town until darkness fully enveloped us. Our destination was unclear, yet each step forward distanced us further from everything we knew. Eventually, we found ourselves on winding paths bordered by vast fields and sparse clusters of houses, each appearing quietly deserted beneath the soft glow of scattered streetlamps.

"Do you think anyone will come looking for us?" I asked, finally breaking the prolonged silence. My voice felt unfamiliar, echoing gently against the emptiness surrounding us.

You kept your gaze forward, expression guarded. "Maybe," you murmured softly. "But would it matter?"

We eventually arrived at a small, unnamed town dimly illuminated by the sterile glow of a single convenience store. The artificial brightness inside felt jarringly intrusive against the comforting darkness we'd grown accustomed to outside. You quietly moved toward the refrigerated drinks, while I browsed nervously through cheap, prepackaged meals and snacks.

"What should we get?" I asked, my voice quieter than intended.

"Just something inexpensive," you replied faintly, eyes fixed wearily on the rows of cold beverages.

We settled on simple rice balls and bottled water, paying quickly with dwindling cash. Sitting silently on a bench outside, the gentle hum of nearby vending machines provided an oddly comforting background noise.

Glancing down at the few coins and bills left in my wallet, anxiety began to creep in. "We're going through our money fast," I confessed softly, worry evident in my tone. "We won't last very long like this."

You briefly met my gaze, expression unreadable in the dim lighting. "We'll figure something out," you replied quietly, your voice calm yet distant, betraying nothing.

As we sat together beneath the pale glow of streetlights, I found myself reflecting on our strange situation. Despite attending the same school, sharing hallways and classrooms, we'd remained complete strangers. I'd observed you from afar, quietly noting your isolated lunches, your withdrawn presence during lessons, and your silent exits after school ended. In your solitude, I'd always felt a distant reflection of my own loneliness, a familiar emptiness mirrored in your quiet movements. We had each lived separately, unnoticed and unloved, trapped within invisible walls we'd never dared to break.

Strange, I thought bitterly, that two strangers could bond so easily simply because neither had ever truly felt loved. With that lonely truth binding us, we both instinctively believed in each other, finding solace in the shared darkness that had shaped us.

We finished our meal quickly, continuing our silent journey deeper into unfamiliar territory until exhaustion forced us to rest. Eventually, we stumbled upon an abandoned bus stop, its worn benches just wide enough to accommodate us both. The dark shelter felt temporary yet secure, a reflection of our uncertain circumstances.

"Are you scared?" you suddenly asked, voice hesitant yet sincere.

I hesitated, not wanting to hide the truth. "Yes," I admitted quietly. "But going back feels scarier."

Your eyes softened slightly, revealing a fleeting vulnerability. "Yeah," you murmured. "There's nothing for us there anyway."

We settled into silence again, listening to the whispering wind through distant fields. Sleep approached slowly, as we sat side by side, quietly accepting our shared uncertainty, neither of us daring to voice the deeper fears and doubts we both silently harbored.`
		},
		{
			title: 'Chapter 3: Summer Saturates',
			content: `Summer closed in around us, the heat oppressive, relentless, magnifying every restless thought swirling inside my mind. Each passing day blurred into the next, a cycle of merciless sunrises and weary nights filled with cicadas whose relentless cries echoed my inner torment.

Our money disappeared faster than anticipated, each purchase amplifying my sense of guilt. With each hunger pang, my conscience whispered that it was all my fault—my mistake, my weakness had led us here, dragging him along into this cruel uncertainty.

We stopped one afternoon beneath a sparse canopy of trees at the edge of an abandoned field, heat radiating fiercely off the cracked earth. I stole a glance at him, his expression distant, lost in thoughts I couldn't reach. My chest tightened painfully; he'd never asked for this, never deserved this torment.

"Do you think we made a mistake?" he finally asked, voice tinged with unease.

His words hit me like a wave of nausea, reinforcing every self-accusation I'd quietly harbored. I turned away, hiding the tremble in my voice. "It doesn't matter now, does it?" I whispered weakly, feeling the immense burden of guilt push down harder upon me.

He remained silent, the weight of his unanswered question hanging heavily in the suffocating air between us.

Nightfall brought little relief; we struggled to find adequate shelter, forced to sleep beneath open skies or under inadequate cover. Rest came fitfully, broken by restless dreams and anxious awakenings. Each morning brought renewed exhaustion, pulling me deeper into quiet despair.

One evening, unable to sleep, I found myself staring upward, losing myself in the vastness of the darkened sky, dotted with distant lights. My heart ached, silently pleading for comfort, for clarity. The stars seemed cold and distant, yet they held an inexplicable allure, as if their light could somehow reach into my darkness.

I sensed him stirring beside me, breaking my solitary moment. I tensed slightly, anxious yet oddly comforted by his presence. The silence stretched between us briefly until his voice gently pierced the quiet.

"You know," he began softly, carefully, as though he feared disturbing the fragile peace we'd found, "those stars—Deneb, Altair, and Vega—they form the Summer Triangle. Their light travels tens, even hundreds of years, just to reach us tonight. Even if the stars themselves have forgotten their brilliance, their glow still finds us."

I turned to him, my heart catching painfully at his words. Something delicate within me shifted, responding to the sincerity in his voice. "Far away," I murmured softly, echoing his sentiment, "a never-ending Betelgeuse. It's strange how magic like that connects two strangers."

He smiled faintly, gently reaching out, his hand hesitantly finding mine beneath the quiet darkness. "Even when things are tough, we'll move forward side by side, right?"

I nodded slightly, gripping his hand gently, the invisible lines connecting us feeling both reassuring and unbearably fragile beneath the vast, indifferent sky. Yet deep within, I couldn't silence the relentless voice that insisted I'd dragged him unwillingly into my darkness. The warmth of his hand, comforting yet fleeting, was not enough to dispel the growing shadow inside me.

As summer saturated every aspect of our existence, the distant stars watched silently, bearing witness to promises I feared we couldn't keep.`
		},
		{
			title: 'Chapter 4: Beneath the Stars',
			content: `The summer night was dense, carrying with it a heaviness that mirrored my own restless thoughts. We lay quietly beneath the vast sky, the world around us swallowed by darkness, leaving only the soft glitter of countless distant stars above.

I glanced over at her, noticing her gaze fixed upward, a lost and distant look in her eyes. Something about her quiet despair tugged painfully at my chest, making my heart ache in ways I couldn't fully articulate. I wanted to comfort her, to break through the silence, even if my words could never fully bridge the chasm growing silently between us.

The thought lingered heavily: Had we made a mistake? My question had remained unanswered earlier, yet it continued to echo within me, unresolved and filled with doubt.

Taking a gentle breath, I finally spoke, my voice soft yet steady. "You know, those stars—Deneb, Altair, and Vega—they form the Summer Triangle. Their light travels tens, even hundreds of years, crossing unimaginable distances just to reach us tonight. Even after their brilliance fades, their glow still finds us somehow. Maybe it's the same with us. Maybe we were meant to find each other, even if we can't see clearly why right now."

Her gaze shifted slightly, eyes now glistening softly in the dim starlight. She spoke quietly, almost whispering, "Far away, a never-ending Betelgeuse. It's strange how magic like that connects two strangers."

A fragile warmth stirred within me, intertwined with anxious fear. I desperately wanted to voice the feelings I'd buried deeply, yet caution held me silent, aware of how delicate our connection had become. Words felt inadequate, potentially harmful, like they might break something irreparable.

Instead, I reached out gently, my hand finding hers hesitantly in the quiet darkness. "Even when things are tough, we'll move forward side by side, right?" My voice was quiet, hopeful yet cautious, seeking reassurance amidst the uncertainty.

Her fingers tightened softly around mine, hesitant but real, offering a subtle affirmation that eased the tension just slightly. In the quietness beneath the vast sky, I silently promised myself never to forget this night—the gentle touch of her hand, the delicate words exchanged, and the stars quietly watching over us.

Some truths, I realized, might remain forever unspoken. Yet their silent presence illuminated my heart more vividly than any distant starlight ever could.`
		},
		{
			title: 'Chapter 5: Ephemeral Freedom',
			content: `Summer's grip tightened around us, the heat relentless, suffocating, pressing heavily against every step we took. Each day wore us down further, draining our energy and dimming the fragile light of hope we had once nurtured.

Our resources had nearly vanished, leaving hunger and exhaustion as our constant companions. Meals became sparse—carefully rationed rice balls, small bottles of water shared between us—barely enough to keep our bodies moving. The rural roads stretched endlessly, quiet and indifferent, lined with abandoned buildings and sparse convenience stores whose shelves mocked our dwindling coins.

One afternoon, we stopped beside an empty roadside stand, its once-bright paint faded, wood warped by exposure to countless summers. My stomach twisted painfully, hunger gnawing relentlessly. Glancing at her, I saw my own desperation reflected vividly in her tired eyes.

"We can't continue like this," I admitted softly, breaking the heavy silence.

She nodded slowly, eyes downcast, avoiding my gaze. "I know. But what choice do we have?" Her voice carried an edge of frustration, tinged with quiet resignation.

My heart tightened painfully. "Maybe... maybe we have to do something we wouldn't normally do," I suggested hesitantly, each word difficult to voice.

She looked sharply at me, her expression a mixture of alarm and reluctant understanding. "You mean steal?" she whispered, her voice barely audible, burdened with fear.

"I don't want to," I admitted, struggling to hold her gaze, "but if it means we survive…" My voice trailed off, heavy with unspoken guilt.

She turned away sharply, her shoulders trembling slightly, whether from anger, fear, or exhaustion, I couldn't tell. "Everything feels wrong," she whispered softly, voice strained. "I dragged you into this. Now we're considering things neither of us ever wanted. What have I done?"

Desperation surged within me, overriding my hesitation. I gently reached out, placing a comforting hand on her trembling shoulder. "It's not your fault," I assured quietly, though my own doubt clouded my words. "We'll figure it out together."

She remained silent, visibly retreating deeper into herself. I withdrew my hand, feeling helpless, the emotional gap widening despite our physical closeness.

That evening, beneath a collapsing bus shelter, we ate our last bits of food in tense silence. Darkness closed around us, deepening our isolation. Nearby, wilted flowers drooped, petals falling, crushed beneath the relentless heat, mirroring our fading strength.

"I'll do it," I suddenly spoke, voice stronger than I felt inside. "Whatever needs to be done."

She looked at me then, eyes wide with fear and sadness. "Are you sure?" Her voice wavered, heavy with worry.

I nodded slowly, feeling the weight of the decision pressing down. "If it keeps us alive, yes."

She sighed softly, turning away, hiding her tears in the shadows. "I'm so sorry," she whispered into the darkness, words filled with a pain I could hardly bear.

As night fell heavily around us, I stared at the dark sky, unable to see stars through the thick clouds overhead. Freedom, it seemed, had become ephemeral, slipping through our fingers as quickly as summer was fading away, leaving us trapped in choices we never imagined we'd face.`
		},
		{
			title: 'Chapter 6: First Sin',
			content: `Morning came like a stain on the sky—grey and breathless. There was no breeze. Even the cicadas, shrill prophets of the season, sounded distant. Muffled. Tired.

We walked without direction, not to escape, but simply to delay. Hunger was no longer a sensation; it had become an idea—sharp, abstract, ever-present. It existed somewhere between our thoughts and our silences. We passed by the first shop slowly. A bell jingled inside as someone came out, holding a sandwich. The smell nearly brought tears to my eyes.

She said nothing. Neither did I.

The second store was brighter, newer. A mother inside with a child tugging at her sleeve. My reflection in the glass looked like it didn't belong there. I kept walking.

The third store we stood in front of. It had dust on the windows. No customers. Just a slouched man at the counter flipping through a magazine. I watched him turn a page with a kind of divine indifference.

"I can't do it," I muttered. The words escaped me before I could dress them in bravery.

She looked at me then, not surprised, just tired. "I know."

And still, we kept walking. Each step sounded like it echoed too long. As if the world had hollowed itself out around us. A stage play of an ending.

By the time we reached the edge of town, I could no longer tell if it was cowardice or acceptance guiding me.

The final store appeared like a mirage, too quiet, too ordinary. A single door, a crooked sign. No cameras. No music. Just a man asleep in a chair behind the counter, mouth slightly open, arms crossed like he'd been waiting to be forgotten.

We stood across the street.

She didn't look at me.

I stepped forward.

The door opened with a chime that felt obscene. I could feel every particle of air press against my skin. I walked past the shelves like a ghost rehearsing a scene. Water. Bread. My hands moved before my mind did.

I thought, briefly, of poetry. Of hungry men in novels who stole apples and felt the shame only after the core had turned brown.

I thought, too, of how absurd it was—my entire life now resting on the weight of this plastic bottle.

I didn't run.

I walked out and didn't look back. She was already ahead of me, as if she couldn't bear to witness what I had become.

When we stopped, it was in the shadow of a narrow wall, the kind that collects heat and reflects silence. We sat.

I handed her the water. She took it like a confession.

"Thank you," she said.

The bread tasted of nothing. The water burned going down. I chewed like someone acting out the idea of eating. As if pretending hard enough might restore something.

"I thought I'd feel something," I said.

She didn't look at me. "You did."

"Did I?"

She turned, eyes unreadable. "You trembled."

We sat in that stillness, guilt quietly blooming between us like a weed. I no longer knew what was mine and what was hers. Only that something had changed.

A thread had been pulled.

The whole cloth would follow.

I looked down at my hands and thought: This is the shape of sin. It has no teeth. No claws. It is soft. It is simple. It is doing what must be done.

Heaven was still far off in the distance.

But the fall had already begun.`
		},
		{
			title: 'Chapter 7: The Distance Between',
			content: `The sky was pale and wide, drained of color. The heat had softened—not cooler, just quieter. It no longer scorched. It lingered. It hung in the air like breath not yet exhaled.

We walked side by side, the same way we always had. Her bag on one shoulder, mine on the other. Our footsteps were in rhythm, but we were not.

I don't remember when the silence began. Maybe it wasn't one moment. Maybe it crept in slowly, like everything else. One less question. One fewer glance. A softness in her voice replaced by nothing at all.

She stared ahead a lot now. Not cold. Just far away.

We passed a field of sunflowers—wilted, drooping toward the dirt. I almost said something about them. About how they used to follow the sun. But I didn't.

At a small rest stop, an old man offered us a bottle of cold barley tea. He didn't ask questions. Just smiled, said, "It's hot out today," and handed it to us like it meant nothing.

We bowed. She said thank you, barely above a whisper. I watched her hands as she took the bottle—thin, slow, deliberate. Like she was afraid of breaking something that had already cracked.

We drank in turns. The tea was sweet. It hurt.

That night, we found a quiet spot under a roadside overhang. Not quite shelter. Just shade. She laid out the thin blanket we shared. I placed my bag down next to hers, but left a little more space than usual.

She didn't look at me when she lay down. Just faced the other way, arms curled inward like she was trying to disappear into herself. I stared at the back of her head, the shape of her shoulders. I wanted to reach out. To say something.

Instead, I looked up at the stars. But tonight, they seemed more distant.

There was no fight. No collapse. No thunder in the sky.

Just space.

The kind that grows between two people who no longer know what to say.

I heard her breathing, slow and steady. Not asleep. Just pretending, maybe. Like me.

We had stolen to survive.

But now something else was slipping away.

That night, for the first time, we slept back to back.

And in that quiet distance, I realized: it wasn't the world that had abandoned us. It was us, drifting slowly from each other, too polite to scream.`
		}
	];
</script>

<svelte:head>
	<title>ibuuvai</title>
	<meta
		name="description"
		content="A digital narrative exploring existence, isolation, and the search for meaning."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Cutive+Mono&family=Major+Mono+Display&display=swap"
		rel="stylesheet"
	/>

	<style>
		@keyframes typing {
			from {
				width: 0;
			}
			to {
				width: 100%;
			}
		}

		@keyframes blink-caret {
			from,
			to {
				border-color: transparent;
			}
			50% {
				border-color: #fff;
			}
		}

		@keyframes blink-caret-end {
			0%,
			79% {
				border-color: transparent;
			}
			30%,
			49% {
				border-color: #fff;
			}
			80%,
			100% {
				border-color: transparent;
			}
		}

		@keyframes typing-line2 {
			0% {
				width: 0;
			}
			50% {
				width: 0;
			}
			100% {
				width: 100%;
			}
		}

		.main-phrase {
			font-size: 1.125rem;
			line-height: 1.5;
		}

		.typing-animation-text {
			display: inline-block;
			overflow: hidden;
			white-space: nowrap;
			width: 0;
			border-right: 3px solid transparent;
			animation:
				typing 1.5s steps(20, end) forwards,
				blink-caret 0.75s step-end 4;
		}

		.typing-animation-text-line2 {
			display: inline-block;
			overflow: hidden;
			white-space: nowrap;
			width: 0;
			border-right: 3px solid #fff;
			animation:
				typing-line2 3s steps(40, end) forwards,
				blink-caret 0.75s step-end 6 1.5s,
				cursor-disappear 0.1s forwards 6s;
		}

		@keyframes cursor-disappear {
			to {
				border-right-color: transparent;
			}
		}

		@media (max-width: 640px) {
			.main-phrase {
				font-size: 0.875rem;
			}

			.typing-animation-text,
			.typing-animation-text-line2 {
				max-width: 90vw;
			}
		}

		/* Custom scrollbar styling */
		.custom-scrollbar::-webkit-scrollbar {
			width: 6px;
		}

		.custom-scrollbar::-webkit-scrollbar-track {
			background: rgba(0, 0, 0, 0.2);
			border-radius: 10px;
			margin: 10px 0;
			border: 1px solid rgba(128, 90, 213, 0.05);
		}

		.custom-scrollbar::-webkit-scrollbar-thumb {
			background: linear-gradient(180deg, rgba(161, 90, 213, 0.6), rgba(128, 90, 213, 0.8));
			border-radius: 10px;
			box-shadow: 0 0 8px rgba(161, 90, 213, 0.3);
			transition: all 0.3s ease;
		}

		.custom-scrollbar::-webkit-scrollbar-thumb:hover {
			background: linear-gradient(180deg, rgba(161, 90, 213, 0.8), rgba(128, 90, 213, 1));
			box-shadow: 0 0 15px rgba(161, 90, 213, 0.5);
		}

		.custom-scrollbar {
			scrollbar-width: thin;
			scrollbar-color: rgba(161, 90, 213, 0.7) rgba(0, 0, 0, 0.2);
			padding-right: 5px;
		}

		.warning-content {
			opacity: 0;
			animation: glitchIn 1.2s forwards;
			animation-delay: 3.2s;
		}

		@keyframes glitchIn {
			0% {
				opacity: 0;
				transform: translateX(-10px) skewX(20deg);
				text-shadow: -2px 0 #ff0000;
				clip-path: inset(0 100% 0 0);
			}
			10% {
				opacity: 0.3;
				transform: translateX(5px) skewX(-10deg);
				text-shadow: 2px 0 #00ff00;
				clip-path: inset(0 80% 0 0);
			}
			20% {
				opacity: 0.5;
				transform: translateX(-3px) skewX(5deg);
				text-shadow:
					-1px 0 #ff0000,
					1px 0 #00ff00;
				clip-path: inset(0 60% 0 0);
			}
			30% {
				opacity: 0.7;
				transform: translateX(2px) skewX(-3deg);
				text-shadow:
					1px 0 #0000ff,
					-1px 0 #ff0000;
				clip-path: inset(0 40% 0 0);
			}
			40% {
				opacity: 0.8;
				transform: translateX(-1px) skewX(1deg);
				text-shadow:
					-1px 0 #00ff00,
					1px 0 #0000ff;
				clip-path: inset(0 20% 0 0);
			}
			50% {
				opacity: 1;
				transform: translateX(0) skewX(0);
				text-shadow:
					1px 0 #ff0000,
					-1px 0 #00ff00;
				clip-path: inset(0 0 0 0);
			}
			60%,
			70% {
				opacity: 1;
				transform: skewX(2deg) translateX(3px);
				text-shadow:
					-1px 0 #ff0000,
					2px 2px #00ff00;
			}
			80%,
			90% {
				opacity: 1;
				transform: skewX(-2deg) translateX(-3px);
				text-shadow:
					1px 0 #ff0000,
					-2px -2px #00ff00;
			}
			100% {
				opacity: 1;
				transform: skewX(0) translateX(0);
				text-shadow: none;
			}
		}

		/* Continuous glitch effect */
		@keyframes glitch {
			0% {
				transform: translate(0);
				text-shadow:
					-1px 0 red,
					1px 0 blue;
			}
			2% {
				transform: translate(-2px, 1px);
				text-shadow:
					1px 0 red,
					-1px 0 blue;
			}
			4% {
				transform: translate(-2px, -2px);
				text-shadow:
					1px 0 green,
					-1px 0 red;
			}
			6% {
				transform: translate(0);
				text-shadow:
					-1px 0 red,
					1px 0 green;
			}
			8% {
				transform: translate(0, 1px);
				text-shadow:
					-1px 0 blue,
					1px 0 red;
			}
			10% {
				transform: translate(0);
				text-shadow:
					-1px 0 red,
					1px 0 blue;
			}
			45% {
				transform: translate(0);
				text-shadow:
					-1px 0 red,
					1px 0 blue;
			}
			46% {
				transform: translateX(3px);
				text-shadow:
					-1px 0 blue,
					1px 0 red;
			}
			48% {
				transform: translateX(-3px);
				text-shadow:
					1px 0 red,
					-1px 0 green;
			}
			50% {
				transform: translateX(0);
				text-shadow:
					-1px 0 red,
					1px 0 blue;
			}
			100% {
				transform: translateX(0);
				text-shadow:
					-1px 0 red,
					1px 0 blue;
			}
		}

		.animate-glitch {
			animation: glitch 4s infinite;
			animation-delay: 4.4s; /* Start after glitchIn finishes */
		}

		.warning-text-1 {
			opacity: 0;
			animation: fadeIn 0.8s ease-out forwards;
			animation-delay: 3.8s;
		}

		.warning-text-2 {
			opacity: 0;
			animation: fadeIn 0.8s ease-out forwards;
			animation-delay: 4.4s;
		}

		.stay-away {
			opacity: 0;
			animation:
				fadeIn 0.8s ease-out forwards,
				enhancedPulse 2s infinite;
			animation-delay: 5s, 5.8s; /* First delay for fadeIn, second for pulse */
			transform-origin: center;
			display: inline-block;
		}

		.blood-drops {
			opacity: 0;
			animation: fadeIn 0.5s ease-out forwards;
			animation-delay: 5.6s;
		}

		.drop-1 {
			animation: fallRepeat 2.5s ease-in infinite;
			animation-delay: 5.8s;
			opacity: 0;
		}

		.drop-2 {
			animation: fallRepeat 3s ease-in infinite;
			animation-delay: 6.2s;
			opacity: 0;
		}

		.drop-3 {
			animation: fallRepeat 2.8s ease-in infinite;
			animation-delay: 6.6s;
			opacity: 0;
		}

		@keyframes fadeIn {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		@keyframes pulse {
			0% {
				opacity: 0.8;
				color: #8b0000;
				text-shadow: 0 0 3px #8b0000;
			}
			50% {
				opacity: 1;
				color: #ff0000;
				text-shadow: 0 0 8px #ff0000;
			}
			100% {
				opacity: 0.8;
				color: #8b0000;
				text-shadow: 0 0 3px #8b0000;
			}
		}

		@keyframes enhancedPulse {
			0% {
				transform: scale(1);
				color: #8b0000;
				text-shadow: 0 0 4px #8b0000;
				filter: brightness(0.9);
			}
			50% {
				transform: scale(1.15);
				color: #ff0000;
				text-shadow:
					0 0 10px #ff0000,
					0 0 15px #ff3333,
					0 0 20px #ff6666;
				filter: brightness(1.2);
			}
			100% {
				transform: scale(1);
				color: #8b0000;
				text-shadow: 0 0 4px #8b0000;
				filter: brightness(0.9);
			}
		}

		@keyframes fall {
			from {
				transform: translateY(0);
			}
			to {
				transform: translateY(100px);
			}
		}

		@keyframes fallRepeat {
			0% {
				transform: translateY(0);
				opacity: 1;
			}
			80% {
				transform: translateY(100px);
				opacity: 1;
			}
			81% {
				opacity: 0;
			}
			82% {
				transform: translateY(0);
				opacity: 0;
			}
			100% {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.page-turn {
			transition: transform 0.5s ease;
		}

		.turn-forward {
			transform: translateX(100%);
		}

		.turn-back {
			transform: translateX(-100%);
		}
	</style>
</svelte:head>

<main class="bg-primary relative flex min-h-screen flex-col justify-start overflow-hidden">
	<!-- Background and main container -->
	<div class="flex flex-1 flex-col">
		{#if mounted}
			<div in:fade={{ duration: 1500, delay: 300 }} class="absolute inset-0">
				<div class="bg-primary absolute inset-0 opacity-90"></div>

				<!-- Background glow - positioned to cover the entire page -->
				<div
					class="bg-accent/8 pointer-events-none fixed top-1/2 left-1/2 h-[70rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[60px]"
				></div>
			</div>

			<!-- Hero Content - Takes full viewport height -->
			<div class="relative flex h-screen flex-col items-center justify-center pt-0">
				<div in:fade={{ duration: 1000, delay: 400 }} class="relative mx-auto max-w-4xl">
					<!-- Avatar and Name - No top margin -->
					<div
						in:fade={{ duration: 1200, delay: 500 }}
						class="flex flex-col items-center justify-center"
					>
						<img
							src="/images/vai.webp"
							alt="Creator Avatar"
							class="animate-pulse-subtle mb-4 h-48 w-48"
							style="transform: translate3d(calc(var(--mx,0)*8px), calc(var(--my,0)*8px), 0)"
						/>
						<span
							class="text-accent animate-text-focus font-handwriting text-3xl font-black uppercase md:text-5xl"
							style="transform: translate3d(calc(var(--mx,0)*4px), calc(var(--my,0)*4px), 0)"
							>VAI Ibu</span
						>
						<div class="mt-2 w-full px-3 text-center">
							<p class="font-handwriting main-phrase font-bold text-white uppercase">
								<span class="typing-animation-text">My existence isn't known</span><br
									class="sm:hidden"
								/>
								<span class="typing-animation-text-line2">by anybody else</span>
							</p>
						</div>
					</div>

					<!-- Keep Out and Warning - Now waiting for typing animation to complete -->
					<div class="mt-3 px-3 text-center">
						<div class="warning-content relative inline-block">
							<div class="absolute inset-0 -m-2 rounded-2xl bg-[#8B0000]/15 blur-[15px]"></div>
							<h1
								class="font-creepy animate-glitch relative mb-1 px-2 text-4xl font-black text-[#8B0000] md:text-7xl"
							>
								Keep out
							</h1>
						</div>

						<div class="relative">
							<p
								class="font-handwriting mx-auto mt-1 max-w-xl px-2 text-center text-base text-white md:text-2xl"
							>
								<span class="warning-text-1 block">So that I will not be fooled...</span>
								<span class="warning-text-2 mt-1 block">So that I won't drag you into this—</span>
							</p>

							<!-- Stay away with drops -->
							<div class="relative mt-1">
								<div class="stay-away">
									<span class="font-creepy text-lg font-bold text-[#8B0000] md:text-2xl"
										>stay away</span
									>
								</div>

								<!-- Dots positioned directly below stay away -->
								<div class="blood-drops absolute top-full left-1/2 mt-1 w-8 -translate-x-1/2">
									<div class="relative h-24 w-full">
										<div
											class="drop-1 absolute top-0 left-3 h-2 w-2 rounded-full bg-[#8B0000]"
										></div>
										<div
											class="drop-2 absolute top-0 left-1 h-1.5 w-1.5 rounded-full bg-[#8B0000]"
										></div>
										<div
											class="drop-3 absolute top-0 left-5 h-1 w-1 rounded-full bg-[#8B0000]"
										></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Command Palette -->
				<CommandPalette journalEntries={journalEntries.map(({id, title}) => ({id, title}))} navigateToTab={navigateToTab} openJournal={openJournalFromPalette} />
			</div>

			<!-- Tabbed Content Area - Positioned below initial viewport -->
			<div class="relative min-h-screen pt-16">
				<!-- Tab Navigation -->
				<div class="mx-auto mb-4 w-full max-w-3xl px-3 md:px-6">
					<div
						class="border-accent/20 shadow-accent/5 grid grid-cols-4 gap-1 rounded-xl border bg-black/30 p-1.5 shadow-lg backdrop-blur-md"
					>
						<button
							onclick={() => selectTab('about')}
							class="font-handwriting relative overflow-hidden rounded-lg px-4 py-3 text-center transition-all duration-300 {selectedTab ===
							'about'
								? 'text-accent bg-gradient-to-br from-black/80 to-black/60 font-bold shadow-inner'
								: 'hover:text-accent text-white hover:bg-black/40'}"
						>
							<span class="relative">Me</span>
							{#if selectedTab === 'about'}
								<div
									class="via-accent absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent to-transparent"
								></div>
							{:else}
								<div
									class="via-accent absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-all duration-500 group-hover:w-full hover:opacity-100"
								></div>
							{/if}
						</button>
						<button
							onclick={() => selectTab('stories')}
							class="font-handwriting relative overflow-hidden rounded-lg px-4 py-3 text-center transition-all duration-300 {selectedTab ===
							'stories'
								? 'text-accent bg-gradient-to-br from-black/80 to-black/60 font-bold shadow-inner'
								: 'hover:text-accent text-white hover:bg-black/40'}"
						>
							<span class="relative">Stories</span>
							{#if selectedTab === 'stories'}
								<div
									class="via-accent absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent to-transparent"
								></div>
							{:else}
								<div
									class="via-accent absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-all duration-500 group-hover:w-full hover:opacity-100"
								></div>
							{/if}
						</button>
						<button
							onclick={() => selectTab('journal')}
							class="font-handwriting relative overflow-hidden rounded-lg px-4 py-3 text-center transition-all duration-300 {selectedTab ===
							'journal'
								? 'text-accent bg-gradient-to-br from-black/80 to-black/60 font-bold shadow-inner'
								: 'hover:text-accent text-white hover:bg-black/40'}"
						>
							<span class="relative">Journal</span>
							{#if selectedTab === 'journal'}
								<div
									class="via-accent absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent to-transparent"
								></div>
							{:else}
								<div
									class="via-accent absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-all duration-500 group-hover:w-full hover:opacity-100"
								></div>
							{/if}
						</button>
						<button
							onclick={() => selectTab('book')}
							class="font-handwriting relative overflow-hidden rounded-lg px-4 py-3 text-center transition-all duration-300 {selectedTab ===
							'book'
								? 'text-accent bg-gradient-to-br from-black/80 to-black/60 font-bold shadow-inner'
								: 'hover:text-accent text-white hover:bg-black/40'}"
						>
							<span class="relative z-10">My Book</span>
							{#if selectedTab === 'book'}
								<div
									class="via-accent absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent to-transparent"
								></div>
							{:else}
								<div
									class="via-accent absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-all duration-500 group-hover:w-full hover:opacity-100"
								></div>
							{/if}
						</button>
					</div>
				</div>

				<!-- Tab Content -->
				<div class="mx-auto w-full max-w-3xl p-2 px-3 md:p-4 md:px-6">
					{#if selectedTab === 'stories'}
						<div in:fade={{ duration: 300 }} class="text-center">
							<h3 class="font-handwriting text-accent mb-4 text-xl">Featured Story</h3>
							<ul class="space-y-3">
								<li class="border-accent/10 border-b pb-2" data-reveal>
									<button
										onclick={toggleStory}
										class="hover:text-accent group relative flex w-full items-center py-2 text-left text-white transition-colors"
									>
										<span class="mr-2 inline-block h-4 w-4 flex-shrink-0">
											{#if isStoryVisible}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="text-accent h-4 w-4"
												>
													<path d="M6 9l6 6 6-6" />
												</svg>
											{:else}
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													class="group-hover:text-accent/70 h-4 w-4 text-white/50"
												>
													<path d="M9 18l6-6-6-6" />
												</svg>
											{/if}
										</span>
										<span
											class="font-handwriting group-hover:text-accent text-base transition-colors {isStoryVisible
												? 'text-accent'
												: ''}">Nontitled</span
										>
										<span class="ml-2 text-xs text-white">2023</span>
									</button>

									{#if isStoryVisible}
										<div
											in:slide={{ duration: 300 }}
											class="border-accent/20 font-handwriting mt-3 border-l-2 pr-2 pl-4 text-left text-sm leading-relaxed whitespace-pre-line text-white"
										>
											<p>
												Loneliness and love are foreign concepts, distant and incomprehensible, our
												human forms already cast aside, discarded long ago. Proof of existence is
												reduced to empty words, scattered meaningless across a cramped, suffocating
												stage. We are performers without an audience, each desperately acting out
												our roles, running breathlessly towards the end credits, even though the
												seats remain vacant.
											</p>

											<p class="mt-2">
												The person I once recognized as myself is no longer here, lost somewhere
												beyond memory. I can't recall a single part I was suited to play. Now, the
												encore has arrived—surely, we are all holding our breath, waiting for the
												dramatic twist. Yet, what do those eyes of yours see? There was a time when
												we were innocent, untouched; but before we realized it, we had turned into
												monsters.
											</p>

											<p class="mt-2">
												Without warning, I became nothing more than a side character, my voice lost
												amidst overwhelming noise. Everyone around desperately shields themselves,
												secretly yearning for a savior's hand to appear. Alone, I shed tears, unable
												to find the truths I had carefully hidden. Looking back, hadn't I discarded
												every emotion? Yet, the tears still flowed inexplicably. Warmth and kindness
												seem suspicious now, every offered hand is mistrusted. Love seeps slowly
												from the wound in my heart, and your gaze threatens my collapse. How pitiful
												I must appear, caught dancing precariously between love and hatred.
											</p>

											<p class="mt-2">
												Enough—I long for ignorance now. Words have become meaningless.
											</p>

											<div class="border-accent/30 my-4 border-l-4 bg-black/20 px-4 py-2 italic">
												"Hey, let's run away to somewhere far away—a place that's not here."
											</div>

											<p class="mt-2">
												A place where the morning dawn gently spills through the wooden cracks,
												illuminating a forgotten path once caressed by winds beneath an eternal
												springtime sky. A place free of scripts, devoid of lines or directors, where
												every moment is fleeting, impossible to retake. A world beyond the frame of
												any camera, a reality untouched even by the widest of lenses. In this hidden
												place, we could taste suspiciously bright fruits without fear of judgment.
											</p>

											<p class="mt-2">
												No one would cry for us. The title flashing across the screen just before
												the end—a story unremembered, incredibly ordinary. This title, abandoned
												like refuse, without even the dignity of a name, belongs solely to you and
												me.
											</p>
										</div>
									{/if}
								</li>
							</ul>
						</div>
					{:else if selectedTab === 'journal'}
						<div in:fade={{ duration: 300 }}>
							<h3 class="font-handwriting text-accent mb-4 text-center text-xl">Recent Entries</h3>
							<ul class="space-y-4">
								{#each journalEntries as entry}
									<li class="border-accent/10 border-b pb-3" id="entry-{entry.id}" data-reveal>
										<button
											onclick={() => toggleJournalEntry(entry.id)}
											class="hover:text-accent group relative flex w-full flex-col py-2 text-left text-white transition-colors sm:flex-row sm:items-center sm:justify-between"
										>
											<div class="flex items-center">
												<span class="mr-2 inline-block h-4 w-4 flex-shrink-0">
													{#if openJournalEntry === entry.id}
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															class="text-accent h-4 w-4"
														>
															<path d="M6 9l6 6 6-6" />
														</svg>
													{:else}
														<svg
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															fill="none"
															stroke="currentColor"
															stroke-width="2"
															stroke-linecap="round"
															stroke-linejoin="round"
															class="group-hover:text-accent/70 h-4 w-4 text-white/50"
														>
															<path d="M9 18l6-6-6-6" />
														</svg>
													{/if}
												</span>
												<span
													class="font-handwriting group-hover:text-accent text-base transition-colors {openJournalEntry ===
													entry.id
														? 'text-accent'
														: ''}">{entry.title}</span
												>
											</div>
											<span class="mt-1 text-xs text-white/70 italic sm:mt-0">{entry.date}</span>
										</button>

										{#if openJournalEntry === entry.id}
											<div
												in:slide={{ duration: 300 }}
												class="border-accent/20 font-handwriting mt-3 border-l-2 pr-2 pl-4 text-left text-sm leading-relaxed whitespace-pre-line text-white"
											>
												{entry.content}
											</div>
										{/if}
									</li>
								{/each}
							</ul>
						</div>
					{:else if selectedTab === 'book'}
						<div in:fade={{ duration: 300 }} class="flex flex-col items-center">
							<div class="mx-auto w-full max-w-3xl">
								<div
									class="border-accent/20 book-container overflow-hidden rounded-2xl border bg-black/40 backdrop-blur-sm"
									data-reveal
								>
									<!-- Chapter Navigation -->
									<div class="border-accent/10 flex items-center justify-between border-b p-4">
										<button
											onclick={() => {
												currentChapter = Math.max(0, currentChapter - 1);
												document
													.querySelector('.book-container')
													?.scrollIntoView({ behavior: 'smooth', block: 'start' });
											}}
											class="hover:text-accent px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
											aria-label="Previous chapter"
											disabled={currentChapter === 0}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
										<span class="text-accent font-handwriting text-lg"
											>{bookChapters[currentChapter].title}</span
										>
										<button
											onclick={() => {
												currentChapter = Math.min(bookChapters.length - 1, currentChapter + 1);
												document
													.querySelector('.book-container')
													?.scrollIntoView({ behavior: 'smooth', block: 'start' });
											}}
											class="hover:text-accent px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
											aria-label="Next chapter"
											disabled={currentChapter === bookChapters.length - 1}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
									</div>

									<!-- Reading progress bar moved to fixed top -->

									<!-- Chapter Content -->
									<div class="chapter-content p-6 md:p-8">
										<div class="prose prose-invert max-w-none">
											<div class="font-handwriting leading-relaxed whitespace-pre-line text-white break-anywhere max-w-[70ch] mx-auto">
												{bookChapters[currentChapter].content}
											</div>
										</div>
									</div>

									<!-- Bottom Chapter Navigation -->
									<div class="border-accent/10 flex items-center justify-between border-t p-4">
										<button
											onclick={() => {
												currentChapter = Math.max(0, currentChapter - 1);
												document
													.querySelector('.book-container')
													?.scrollIntoView({ behavior: 'smooth', block: 'start' });
											}}
											class="hover:text-accent px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
											aria-label="Previous chapter"
											disabled={currentChapter === 0}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
										<span class="text-accent font-handwriting text-lg"
											>{bookChapters[currentChapter].title}</span
										>
										<button
											onclick={() => {
												currentChapter = Math.min(bookChapters.length - 1, currentChapter + 1);
												document
													.querySelector('.book-container')
													?.scrollIntoView({ behavior: 'smooth', block: 'start' });
											}}
											class="hover:text-accent px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
											aria-label="Next chapter"
											disabled={currentChapter === bookChapters.length - 1}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fill-rule="evenodd"
													d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
													clip-rule="evenodd"
												/>
											</svg>
										</button>
									</div>
								</div>

								<!-- Fixed top reading progress bar (visible only in Book tab) -->
								{#if selectedTab === 'book'}
									<div class="fixed top-0 left-0 right-0 pointer-events-none">
										<div class="h-[2px] bg-white/10">
											<div class="h-[2px] bg-accent transition-[width] duration-200" style="width: {Math.round(bookProgress * 100)}%"></div>
										</div>
									</div>
								{/if}
							</div>
						</div>
					{:else if selectedTab === 'about'}
						<div in:fade={{ duration: 300 }} class="flex flex-col items-center">
							<div class="mx-auto mb-8 w-full max-w-3xl">
								<!-- Main profile section with image and name -->
								<div class="relative mb-8">
									<div
										class="border-accent/20 relative flex flex-col items-center overflow-hidden rounded-2xl border bg-black/40 backdrop-blur-sm md:flex-row"
										data-reveal
									>
										<div class="flex flex-shrink-0 flex-col items-center p-6 md:items-start md:p-8">
											<img
												src="/images/ibuuvai.webp"
												alt="Vai Ibuu"
												class="shadow-accent/10 mb-4 h-72 w-72 shadow-lg md:h-80 md:w-80"
											/>
										</div>

										<div class="flex-grow p-6 md:p-8">
											<!-- Stats cards -->
											<div class="mb-6 grid grid-cols-2 gap-3">
												<div
													class="border-accent/10 flex flex-col items-center justify-center rounded-xl border bg-black/30 p-4"
												>
													<span class="text-accent text-2xl font-bold">vai</span>
													<span class="text-xs tracking-wider text-white/60 uppercase">name</span>
												</div>

												<div
													class="border-accent/10 flex flex-col items-center justify-center rounded-xl border bg-black/30 p-4"
												>
													<span class="text-accent text-2xl font-bold">22</span>
													<span class="text-xs tracking-wider text-white/60 uppercase">age</span>
												</div>
											</div>

											<div
												class="border-accent/10 mb-4 rounded-xl border bg-black/30 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
											>
												<div class="text-accent mb-3 text-sm font-bold tracking-wider uppercase">
													Loves
												</div>
												<div class="flex flex-wrap gap-2">
													<span
														class="bg-accent/10 text-accent/90 font-handwriting hover:bg-accent/20 rounded-full px-3 py-1.5 text-xs transition-all duration-300"
													>
														Afternoon Nap
													</span>
													<span
														class="bg-accent/10 text-accent/90 font-handwriting hover:bg-accent/20 rounded-full px-3 py-1.5 text-xs transition-all duration-300"
													>
														Reading
													</span>
												</div>
											</div>

											<div class="mb-4 flex flex-col items-center space-y-3">
												<div
													class="custom-scrollbar flex h-64 w-full flex-col items-center space-y-3 overflow-y-auto pr-2"
												>
													<div
														class="border-accent/10 w-64 rounded-xl border bg-black/30 px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
													>
														<div class="mb-1 font-mono text-sm text-purple-400">Height</div>
														<div class="font-handwriting text-white">185cm (6'3)</div>
													</div>

													<div
														class="border-accent/10 w-64 rounded-xl border bg-black/30 px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
													>
														<div class="mb-1 font-mono text-sm text-purple-400">Birthday</div>
														<div class="font-handwriting text-white">31st July</div>
													</div>

													<div
														class="border-accent/10 w-64 rounded-xl border bg-black/30 px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
													>
														<div class="mb-1 font-mono text-sm text-purple-400">Zodiac Sign</div>
														<div class="font-handwriting text-white">Leo</div>
													</div>

													<div
														class="border-accent/10 w-64 rounded-xl border bg-black/30 px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
													>
														<div class="mb-1 font-mono text-sm text-purple-400">Favorite Food</div>
														<div class="font-handwriting text-white">Salmon Sushi</div>
													</div>

													<div
														class="border-accent/10 w-64 rounded-xl border bg-black/30 px-4 py-3 text-center backdrop-blur-sm transition-all duration-300 hover:bg-black/40"
													>
														<div class="mb-1 font-mono text-sm text-purple-400">Favorite Pet</div>
														<div class="font-handwriting text-white">White Cat</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div class="border-accent/20 mt-6 rounded-2xl border bg-black/30 p-4 md:p-6" data-reveal>
									<div class="mb-4 flex items-center justify-between">
										<h3 class="text-accent font-handwriting text-lg">Curriculum Vae Victis</h3>
										<span class="rounded-full border border-accent/20 bg-accent/10 px-2 py-1 text-[10px] uppercase tracking-wide text-accent/90">not for employment; for evidence</span>
									</div>

									<div class="space-y-6 font-handwriting">
										<section>
											<h4 class="text-white/90 mb-1 font-handwriting text-xs tracking-wider uppercase">Profile</h4>
											<p class="font-handwriting text-white/80 leading-relaxed">Born of bad timing; domesticated by poems. I collect exits, broken promises, and sentences that refuse to behave. If there is a way to love incorrectly, I have documented it with care.</p>
										</section>

										<section>
											<h4 class="text-white/90 mb-2 font-handwriting text-xs tracking-wider uppercase">Selected Works</h4>
											<ul class="grid grid-cols-1 gap-2 md:grid-cols-2">
												<li class="border-accent/10 rounded-lg border bg-black/20 px-3 py-2 text-white/80"><span class="font-handwriting">a letter that will never reach you</span><span class="text-white/50"> — endurance, performed badly.</span></li>
												<li class="border-accent/10 rounded-lg border bg-black/20 px-3 py-2 text-white/80"><span class="font-handwriting">The silent collapse of a heart</span><span class="text-white/50"> — a study in exquisite damage.</span></li>
												<li class="border-accent/10 rounded-lg border bg-black/20 px-3 py-2 text-white/80 md:col-span-2"><span class="font-handwriting">at the mercy of my dreams</span><span class="text-white/50"> — field notes from a beautiful failure.</span></li>
											</ul>
										</section>

										<section>
											<h4 class="text-white/90 mb-2 font-handwriting text-xs tracking-wider uppercase">Experience</h4>
											<ul class="space-y-2">
												<li class="border-accent/10 rounded-lg border bg-black/20 p-3">
													<div class="flex items-center justify-between text-white/90"><span class="font-handwriting">Amateur witness to my own life</span><span class="text-[10px] text-white/50 uppercase tracking-wide">ongoing</span></div>
													<p class="text-white/70 mt-1 text-sm">watch; refuse rescue; remember too clearly.</p>
												</li>
												<li class="border-accent/10 rounded-lg border bg-black/20 p-3 text-white/80">Co-conspirator with loneliness — delivered daily.</li>
												<li class="border-accent/10 rounded-lg border bg-black/20 p-3 text-white/80">Keeper of an unnecessary book — still writing it.</li>
											</ul>
										</section>

										<section>
											<h4 class="text-white/90 mb-2 font-handwriting text-xs tracking-wider uppercase">Competencies</h4>
											<div class="flex flex-wrap gap-2">
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs">Precision melancholy</span>
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs">Sustainable doubt</span>
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs">Elegant retreat</span>
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs">Transmuting hurt</span>
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs">Distilling silence</span>
												<span class="bg-accent/10 text-accent/90 rounded-full px-3 py-1 text-xs">Disappearing politely</span>
											</div>
										</section>

										<section>
											<h4 class="text-white/90 mb-2 font-handwriting text-xs tracking-wider uppercase">Achievements</h4>
											<ul class="list-disc space-y-1 pl-5 text-white/80">
												<li>Survived the days I said I wouldn't. <span class="text-white/50">(several)</span></li>
												<li>Remembered small details no one thought important, and kept them alive.</li>
												<li>Apologised to the future without disturbing the past.</li>
											</ul>
										</section>

										<section>
											<h4 class="text-white/90 mb-2 font-handwriting text-xs tracking-wider uppercase">References</h4>
											<p class="text-white/70">Denied, with affection. The relevant people are tired; let them rest.</p>
										</section>
									</div>

									<div class="mt-6 text-right">
										<span class="font-handwriting text-white/80">signed—</span>
										<span class="font-handwriting text-accent italic">vai</span>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	<!-- Cursor aura (subtle, pointer-events none) -->
	{#if enableMotion}
		<div class="pointer-events-none fixed" style="top: var(--cursor-y); left: var(--cursor-x); transform: translate(-50%, -50%);">
			<div class="cursor-aura"></div>
		</div>
	{/if}
</main>
