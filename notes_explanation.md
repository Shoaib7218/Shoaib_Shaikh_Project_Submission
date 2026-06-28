so basically i was given this task tracker assignment where i had to find bugs and fix them, here is what i found and how i solved them

the first thing i noticed was the filter wasnt working at all, like when i selected open status it was still showing done and in progress tasks, so i looked at the query and honestly i didnt fully understand why it was broken at first, the query looked fine to me, so i took help from ai to understand it and turns out sql has this thing where AND runs before OR automatically, so the query was basically splitting into two separate conditions because of missing parentheses, the status filter and archived check were only applying to the description part, not the title part, so any task that matched by title was coming through regardless of status, the fix was just wrapping the title and description OR condition in parentheses so all three conditions applied to every row equally

then i noticed the same broken query existed in two sql files, the h2 query file and the oracle plsql package both had the exact same missing parentheses, and in the oracle file the bug was in two places, the count query and the paginated select both had it, fixed both

then i was looking at the backend controller and found that if someone passed a random invalid status value it would crash with a 500 error because taskstatus.valueof just throws an exception and nobody was catching it, so i wrapped it in a try catch and now it returns a proper 400 with a message instead of crashing

also in the same controller there was this weird thread.sleep thing happening where the backend wasintentionally sleeping up to 1000ms based on how short the search query was, like shorter queries got more sleep which makes no sense, it was called complexity score but it was just slowing everything down for no reason, removed it completely

on the frontend i noticed that if you were on page 3 and then changed the filter or search, it would fetch page 3 of the new results, and if the filtered results had less than 30 items total you would get nothing even though results existed on page 1, the fix was simple, whenever query or status changes just reset page back to 1

then i found that if any api request failed the loading spinner just stayed forever, because setloading false was only in the success path, not in the catch block, so on any error the ui just showed loading tasks forever, added the missing setloading false in catch

and the numbering going backwards was because the table was showing task.id as the row number, since tasks are fetched newest first the highest ids come on page 1 and lowest ids on the last page, so it looked like it was counting backwards, the fix was replacing task.id with a computed serial number based on page and index so it always shows 1 2 3 properly across all pages

and last thing was every single keystroke in the search box was firing an api call, so typing login bug was sending 9 separate requests, added a 300ms debounce so it only fires after the user stops typing
