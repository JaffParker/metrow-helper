$(document).ready(function () {
	if (document.location.href.includes('assignment')) {
		const optionsBar = $('<div />')
		$('.article').prepend(optionsBar)
		optionsBar.css({
			'padding': '20px',
			'background-color': '#f8f8f8'
		})

		const emails = []
		$('.directory .contact').each(function () {
			emails.push($(this).find('.field:nth-child(3)').text().trim())
		})

		const stationName = $('.article > .assignment > h2:nth-child(1) > strong').text()
			.match(/Station : ([A-Za-zàâçéèêëîïôûùüÿñæœ-]+)/)[1]

		const emailedCheckbox = $('<input type="checkbox" />')
		const mailtoLink = $('<a />')
		mailtoLink.attr('href', `mailto:${emails.join(',')}`)
		mailtoLink.attr('target', '_blank')
		mailtoLink.text('Copy station name and email all publishers')
		mailtoLink.on('click', () => {
			emailedCheckbox.prop('checked', true)
			const textarea = document.createElement('textarea')
			textarea.value = stationName
			document.body.appendChild(textarea)
			textarea.select()
			document.execCommand('copy')
			document.body.removeChild(textarea)
		})

		optionsBar.append(emailedCheckbox)
		optionsBar.append('&nbsp;')
		optionsBar.append(mailtoLink)
	}

	if (document.location.href.includes('schedule')) {
		const topBar = $('<div />')
		$('.assignment-filter').after(topBar)
		$('#date-filter').change(filterAndDisplayAssignments)
		filterAndDisplayAssignments()

		function filterAndDisplayAssignments() {
			topBar.empty()
			const assignments = []

			$('.assignment:not(.hidden-by-date)').each(function () {
				const detailsMatch = $(this).find('.details').text()
					.match(/Station : ([A-Za-zàâçéèêëîïôûùüÿñæœÀÂÇÉÈÊËÎÏÔÛÙÜŸÑÆŒ:' /-]+)\(Local (St-Michel|Frontenac)\)( FROID\/COLD)?( ?\*(\*\*)?)? on ((Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday), (January|February|March|April|May|June|July|August|September|October|November|December)\s\d{1,2},\s\d{4})\s (.*)/)

				assignments.push({
					station: detailsMatch[1].trim(),
					date: detailsMatch[6],
					time: detailsMatch[9],
					a: $(this).find('h3 > a').attr('href')
				})
			})

			const assignmentsByDateAndStation = _.mapValues(_.groupBy(assignments, 'date'), ass => _.groupBy(ass, 'station'))
			_.forIn(assignmentsByDateAndStation, (assgmts, date) => {
				const dayContainer = $('<div />').css({ padding: '15px' })
				const flexContainer = $('<div />').css({
					display: 'flex',
					'align-items': 'flex-start',
					'flex-wrap': 'wrap'
				})

				topBar.append(dayContainer)
				dayContainer.append(`<h3>${date} | <small>${_.keys(assgmts).length} stations</small></h3>`)
				dayContainer.append(flexContainer)

				_.forIn(assgmts, (ass, station) => {
					console.log(ass)
					const stationContainer = $('<div />').css({
						padding: '10px'
					})
					const assList = $('<div />').css({
						padding: '5px'
					})
					stationContainer.append(`<h4>${station}</h4>`)
					stationContainer.append(assList)

					_.forIn(ass, singleAss => {
						assList.append($(`<a>${singleAss.time}</a>`)
							.attr('href', singleAss.a)
							.click(function () {
								openInBackgroundTab(this.href)
								return false
							}))
						assList.append('<br />')
					})

					flexContainer.append(stationContainer)
				})
			})
		}
	}
})

function openInBackgroundTab(link) {
	var a = document.createElement('a')
	a.href = link
	const ev = document.createEvent('MouseEvents')
	ev.initMouseEvent(
		"click", true, true, window, 0, 0, 0, 0, 0,
		true, false, false, false, 0, null
	)
	a.dispatchEvent(ev)
}
