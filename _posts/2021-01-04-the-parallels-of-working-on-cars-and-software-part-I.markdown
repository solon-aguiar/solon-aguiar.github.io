---
layout: post
title:  The parallels of working on cars and software - Part I
date:   2021-01-04 18:56:00 -0700
categories: tech random
excerpt: My thoughts on how similar working on cars and software projects can be
---

A little over a year ago, in July 2019, I decided to buy an old beat up Volkswagen type IV engine and rebuild it from the bottom up. The small print on the corner is that, at the time, I had never worked on car engines. Better (or worse in this case), I had never worked on anything related to cars - not even changed a tire.

The desire to get my hands dirty and learn about cars along with the stupidity, naiveté and some free time got me started on the endeavor. Despite having a basis to start, after all the famous [idiot book](https://www.amazon.com/dp/1566913101), which I had bought a few weeks earlier, described the process in layman terms, I still didn’t feel confident enough to do it all on my own. I knew that there was room for catastrophical error, so I was looking for a safety net.

![Engine crankshaft on our working table](/assets/images/engine-crankshaft.jpg)
*The crankshaft on our working table* 

Luckily, my friend Jim, who not only had Volkswagens in the old days, but also worked on his cars himself, volunteered to help me out - a decision that to this day he probably regrets. Helping out is an understatement. Jim spent dozen of hours in cold humid garage with me through Seattle’s autumn and winter, being an essential figure in the whole process. Truth to be told, the rebuilding of the engine really was an accomplishment of our us as a team. I couldn’t have done without him.

Looking back at that whole experience, a lot of parallels can be drawn about the world of software and working on cars. I will discuss some of those throughout this post. These, by no means, are indisputable truths. Rather, it reflects my thoughts on how ideas and practices from these seemingly distinct domains surface in each area.

Buckle up and enjoy the ride … (mandatory car pun).

# The project

This parallel is obvious, but worth making it clear. The goal was to rebuild the engine - just the engine and nothing else. Engine, in this context, means the long block, which is comprised of the cylinder heads, pistons, connecting rods, bearings, crankshaft, camshaft (all of which are inside the case), pushrods and valves. If these terms are alien to you, don’t worry. They don’t have any relevancy to the rest of the post.

The scope, then, was clear. We were focused on the engine. We were not going to touch any other part of the system, like suspension, transmission, fuel lines, brakes etc. Limiting the scope reduced the number of moving parts and allowed us to trust that the whole system was working prior to any change - after all the car was fully functional and drivable before the engine rebuild.

Like a software project, focus helps achieve better results. It is easy to scope creep and let other tasks pile up (“hey, since we’re at it, why not replace the brakes?”). While these could be perfectly valid improvements and add-ons, the smaller the change is, the faster we can get feedback. With faster feedback, we can quickly validate that we’re delivering the desired functionality.

Driving (another pun) the analogy even further, one could argue that I could have done an even more focused work. I could, say, have replaced one cylinder head, fired up the engine to see it works (feedback) before going to the next task. This is a great idea, however, the world of of car tinkering is a little bit more complicated than that, especially with regards to the deployment process of an engine as you’ll read in the next section…

# The deployment process

There’s no way to change the engine while the car is running. Even if there was (while the car is rolling down an extremely long hill?), it would be too risky and inconceivable for my (or Jim’s) abilities. This is an area that the world of software is way better equipped to do.

Blue-green deployments are the norm in all respectable software systems today, so it is normal to take it for granted. Past are the days when we had to take systems down for "maintenance” during periods of low load. Nowadays, we can deploy hundreds of times a day without any customer impact.

Even when completely reworking parts of a system (say, in a new tech stack), assuming we maintain the interface unchanged (aka no backwards incompatible change), we can completely replace parts of a system while it is still running. Unfortunately, for Jim and I, we couldn’t do that with our engine. In conclusion, there was going to be downtime. The car had to be parked in the garage and not moved for as long as the engine was out (luckily I had another car to drive around - especially to go get the new parts!). 

As I said in the previous section, we could also have reduced the scope of change per unit of work. We could have replaced one part at a time to get feedback on individual components. The sole nature of changing an engine part, however, would make the timeline of the project explode exponentially. If we were to follow this release process, we would have to jack up the car, drop the engine, disassemble all of the peripherals, replace the specific part, assemble the peripherals, put the engine back in the car, remove the car from stands and fire it up. This would be easily a 20-hour process per part - and we had dozens of parts to replace. The trade-off was clear and easy to reason upon. We didn’t even had to discuss it - we were going to replace the whole engine at once at risk failure. Even if it failed and we had to remove it to fix it, it would take less time than to do it one part at a time.

# The tools

This is also another obvious parallel - we need tools for working on cars and on software. For the engine rebuild, I started with the set of tools that I had (hammer, crescent and open ended wrenches) and throughout many weekends had to get familiar with a whole new myriad of tools: from torque wrenches all the way to digital calipers. From rustic wood blocks used to banging on metal to voltmeters used to measure current in the fuel injection circuit. From fine bolt threads to silicon gaskets. I even had to get acquainted with a lot of new vocabulary that I had never realized existed.

In software engineering it is no different. We start with some basic tools such as our favorite IDE or programming language and start to pick up new ones along the way: new programming languages, frameworks, testing tools, linters, compilers, version control, logging, operating system etc.

As with most tools, no matter how good the tool in front of you is, if you don’t know how to use it properly, it won’t help you much. I had to learn the best technique to use a torque wrench, how to get an accurate reading out of a digital caliper, how to use a voltmeter, how to properly apply a gasket etc. The same holds true for software. If you don’t know how to write good tests, that new shiny testing framework won’t help you much. If you don’t know how to write good logs, the log search tool won’t bring any benefit.

It could also be that you didn’t even know that a tool for a specific job existed (like I didn’t know of digital calipers). A lot of the time, it means that you never had a need or it, but it could also be that you just reinvented the wheel (another car pun). One way or another, learning how to best use it will probably benefit you in the short and long term, so there’s no reason not to do it.


# The bibliography

Even the most seasoned mechanic will maintain a set of manuals in their shop. These are used as reference for complicated procedures, measurements, part numbers etc. They are essential in any mechanic's toolkit and it wouldn't be an understatement to consider them essential.

Not knowing that, but rather admitting my ignorance on the subject, I was equipped with three different manuals on the engine that I was working. My idea was that I would have as much information as possible when I got stuck (note that I knew I was going to get stuck, I just didn’t know at what moment). Looking back, I am completely confident to say that I wouldn’t have finished the work without them (even with all of Jim’s immense knowledge). Each one of these books provided valuable information that complemented each other when one was lacking important details.

When these books failed to contain a need procedure or troubleshooting guide, I resorted to the community (which is very friendly and helpful in the VW world) as a source of information and ideas.

The importance of good documentation is not unknown to a software practitioner. One commonly uses many sources of information to assist them on their daily jobs: from reading books on tools and techniques to using StackOverflow to find an answer to that lingering question or exception error code. As computer programmers, it can often be tedious and cumbersome to write good documentation. An argument that I’ve often used in the past for not writing good documentation is that good code documents itself. While I still believe on that adage, I realize that we don’t always have the time to dig into the code of a library or a dependency that we use.

I think that most of us agree that well written documentation is extremely important to help us do our jobs well. Writing documentation and manuals is a skill often overlooked, but that I’ve found to be very important and hard to do well. The way I see it, if no one uses the code that I write, then what is the point of writing it? Documenting is step in getting your code used.


# Pairing & Mentoring

No novice mechanic starts doing all the work by themselves right away. It takes two years for a novice [ASE](http://www.ase.com/) student to be certified. During this time your work is accompanied by more senior mechanics and you do have to pass a test at the end of the period.

Although not related to the ASE at all, my work on the engine followed a similar mentorship pattern. As Jim had a lot more experience with engines and cars in general, he guided me throughout all of the process, often taking the lead on the very most delicate steps (such as dropping the distributor shaft!) after we discussed and agreed on the path forward. He taught me a lot - from the simple difference about bolt thread types, through the best way to use a torque wrench and to the best way to tighten the cylinder heads. Meanwhile, though not teaching him much other than my awesome jokes, I was (or at least like to think I was) a good source of ideas and someone to verify the work and procedures.

The first full time job that I had as a computer programmer was at a consultancy company called [ThoughtWorks](http://thoughtworks.com/). At ThoughtWorks we always paired programmed - by always, I really mean 100% of the time. For a lot of people, the idea of two engineers pair programming all of the time is a waste of time and resources. After all, you could double the throughput by having the two people working separately. You’d have twice as much code produced!

The problem with that mindset of lines-of-code-written as a measure of efficiency is that with double the throughput, you double the bugs! As most of us know, software maintenance incurs more costs than actually software development, which makes fixing bugs more expensive than producing them! That is the rationale behind pair programming: an extra pair of eyes can catch issues before they are live and causing issues in production.

Another more subtle benefit of pair programming is career development. Especially for more junior engineers (or mechanics), having the time and opportunity to work alongside a more seasoned practitioner is of invaluable value. One can learn common practices and techniques,  that would normally take months or years to develop by themselves. On top of that, by working with more experienced people, rookies can often feel more empowered to take risks or question the status quo, as the new thoughts can often be discussed in the pair before being brought up to a wider audience. The constant mentorship, in my point of view, is not only valuable in technical terms, but also on personal terms, as it can be (assuming that the relationship is healthy) empowering.

Realizing those benefits, but not willing (or not being able) to sacrifice programmers time so much, a lot of companies nowadays use code reviews as part of their software development cycle. The idea is that it yields similar benefits whilst still allowing programmers to work on separate tasks. In my experience this can be true: when people (the rookie and the experienced) realize that offline mentoring takes more effort than just being side by side and do spend their time and attention on the process, it is very beneficial; when one side or another take it for granted, then they’re setting themselves up for failure.

As I said earlier, Jim and I paired most of the time. On some occasions, when he wasn’t able to join me, Jim reviewed my work at a later time. The pairing was mostly valuable in the first few weeks when a lot was new and unknown. The reviewed process was more common in the end, when I was more confident on my abilities.

—

I have more to share! This post was already getting very large, so, like any good story, I decided to break it down into a trilogy.

Stay tuned for part two, where I will cover some parallels between the work of software and the word of cars that, at least for me, are not as obvious as the ones listed here.