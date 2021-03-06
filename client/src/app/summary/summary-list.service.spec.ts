import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Summary} from "./summary";
import {SummaryListService} from "./summary-list.service";
import {SummaryListComponent} from "./summary-list.component";

describe('Summary: ', () => {
    // A small collection of test summaries

    const testSummarys: Summary[] = [
        {
            _id: '1',
            mood: 'happy',
            date: '03/13/2018',
            intensity: 2,
            description: 'slept',
        },
        {
            _id: '2',
            mood: 'sad',
            date: '03/14/2018',
            intensity: 4,
            description: 'friend died',
        },
        {
            _id: '3',
            mood: 'mad',
            date: '03/15/2018',
            intensity: 5,
            description: 'didnt sleep',
        },
    ];
    const mSummarys: Summary[] = testSummarys.filter(summary =>
        summary.mood.toLowerCase().indexOf('a') !== 3
    );

    // We will need some url information from the summaryService to meaningfully test category filtering;
    // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
    let summaryService: SummaryListService;
    let currentlyImpossibleToGenerateSearchSummaryUrl: string;

    // These are used to mock the HTTP requests so that we (a) don't have to
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service with the mock
        // HTTP client.
        summaryService = new SummaryListService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getSummarys() calls api/summarys', () => {
        // Assert that the summarys we get from this call to getSummarys()
        // should be our set of test summarys. Because we're subscribing
        // to the result of getSummarys(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testSummarys) a few lines
        // down.
        summaryService.getSummarys().subscribe(
            summarys => expect(summarys).toBe(testSummarys)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(summaryService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testSummarys);
    });

    it('getSummarys(summaryCategory) adds appropriate param string to called URL', () => {
        summaryService.getSummarys('a').subscribe(
            summarys => expect(summarys).toEqual(mSummarys)
        );

        const req = httpTestingController.expectOne(summaryService.baseUrl + '?mood=a&');
        expect(req.request.method).toEqual('GET');
        req.flush(mSummarys);
    });

    it('filterByMood(summaryMood) deals appropriately with a URL that already had a mood', () => {
        currentlyImpossibleToGenerateSearchSummaryUrl = summaryService.baseUrl + '?mood=m&something=k&';
        summaryService['summaryUrl'] = currentlyImpossibleToGenerateSearchSummaryUrl;
        summaryService.filterByMood('a');
        expect(summaryService['summaryUrl']).toEqual(summaryService.baseUrl + '?something=k&mood=a&');
    });

    it('filterByMood()terByMood()) deals appropriately with a URL that already had some filtering, but no mood', () => {
        currentlyImpossibleToGenerateSearchSummaryUrl = summaryService.baseUrl + '?something=k&';
        summaryService['summaryUrl'] = currentlyImpossibleToGenerateSearchSummaryUrl;
        summaryService.filterByMood('m');
        expect(summaryService['summaryUrl']).toEqual(summaryService.baseUrl + '?something=k&mood=m&');
    });

    it('filterByMood()terByMood()) deals appropriately with a URL has the keyword Mood, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchSummaryUrl = summaryService.baseUrl + '?mood=&';
        summaryService['summaryUrl'] = currentlyImpossibleToGenerateSearchSummaryUrl;
        summaryService.filterByMood('');
        expect(summaryService['summaryUrl']).toEqual(summaryService.baseUrl + '');
    });
});
