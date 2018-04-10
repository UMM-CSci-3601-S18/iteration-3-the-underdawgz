/**import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {crisis} from "./crisis";
import {CrisisService} from "./crisis.service";

describe('Crisis service: ', () => {
    // A small collection of test journals
    const testCrisis: crisisNumber[] = [
        {
            _id: 'buying_id',
            subject: 'Buying food',
            body: 'I went to the ice cream store today for a sundae.',
            date: "Sat Jan 27 13:36:47 CST 2018"
        },
        {
            _id: 'visit_id',
            subject: 'Visit mom',
            body: 'I went to my Mom\'s house to talk to her.',
            date: "Sun Feb 12 16:32:41 CST 2018"
        },
        {
            _id: 'running_id',
            subject: 'Go on amazing run',
            body: 'I went on a 25 mile run today!',
            date: "Mon Mar 11 19:26:37 CST 2018"
        }
    ];
    const mJournals: crisisNumber[] = testCrisis.filter(journal =>
        journal.subject.toLowerCase().indexOf('m') !== -1
    );

    let journalListService: CrisisService;
    let currentlyImpossibleToGenerateSearchJournalUrl: string;

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
        journalListService = new CrisisService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getJournals() calls api/journals', () => {

        journalListService.getJournals().subscribe(
            journals => expect(journals).toBe(testJournals)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(journalListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testJournals);
    });

    it('getJournals(journalSubject) adds appropriate param string to called URL', () => {
        journalListService.getJournals('m').subscribe(
            journals => expect(journals).toEqual(mJournals)
        );

        const req = httpTestingController.expectOne(journalListService.baseUrl + '?subject=m&');
        expect(req.request.method).toEqual('GET');
        req.flush(mJournals);
    });

    it('filterBySubject(journalSubject) deals appropriately with a URL that already had a subject', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?subject=f&something=k&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterBySubject('m');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '?something=k&subject=m&');
    });

    it('filterBySubject(journalSubject) deals appropriately with a URL that already had some filtering, but no subject', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?something=k&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterBySubject('m');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '?something=k&subject=m&');
    });

    it('filterBySubject(journalSubject) deals appropriately with a URL has the keyword subject, but nothing after the =', () => {
        currentlyImpossibleToGenerateSearchJournalUrl = journalListService.baseUrl + '?subject=&';
        journalListService['journalUrl'] = currentlyImpossibleToGenerateSearchJournalUrl;
        journalListService.filterBySubject('');
        expect(journalListService['journalUrl']).toEqual(journalListService.baseUrl + '');
    });

    it('getJournalByID() calls api/journals/id', () => {
        const targetJournal: Journal = testJournals[1];
        const targetId: string = targetJournal._id;
        journalListService.getJournalById(targetId).subscribe(
            journal => expect(journal).toBe(targetJournal)
        );

        const expectedUrl: string = journalListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetJournal);
    });

    it('adding a journal calls api/journals/new', () => {
        const plunging_id = { '$oid': 'plunging_id' };
        const newJournal: Journal = {
            _id: 'plunging_id',
            subject: 'Bathroom duties today',
            body: 'Incidents occurred, so the toilet was plunged asap.',
            date: "Mon Mar 11 19:26:37 CST 2018"
        };

        journalListService.addNewJournal(newJournal).subscribe(
            id => {
                expect(id).toBe(plunging_id);
            }
        );

        const expectedUrl: string = journalListService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(plunging_id);
    });

    it('editing a journal calls api/journals/edit', () => {
        const washing_id = { '$oid': 'washing_id' };
        const editJournal: Journal = {
            _id: 'washing_id',
            subject: 'After cleaning today',
            body: 'My hands got a little dirty doing chores, so I washed them.',
            date: "Sat Feb 21 19:16:37 CST 2018"
        };

        journalListService.editJournal(editJournal).subscribe(
            id => {
                expect(id).toBe(washing_id);
            }
        );

        const expectedUrl: string = journalListService.baseUrl + '/edit';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(washing_id);
    });

});
*/
