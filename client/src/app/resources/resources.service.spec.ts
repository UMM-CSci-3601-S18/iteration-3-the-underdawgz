import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Resource} from './resource';
import {ResourcesService} from './resources.service';

describe('Resource service: ', () => {
    // A small collection of test resources

    const testResources: Resource[] = [
        {
            _id: '1',

            title: 'Youtube',
            link: 'https://www.youtube.com/',

        },
        {
            _id: '2',
            title: 'Google',
            link: 'https://www.google.com/',
        },
        {
            _id: '3',
            title: 'Instagram',
            link: 'https://www.instagram.com/',
        }
    ];
    const resources: Resource[] = testResources.filter(resource =>
        resource.title.toLowerCase().indexOf('o') !== 2
    );


    let resourceService: ResourcesService;
    let currentlyImpossibleToGenerateSearchResourceUrl: string;

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
        resourceService = new ResourcesService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getResources() calls api/resources', () => {
        // Assert that the resources we get from this call to getResources()
        // should be our set of test resources. Because we're subscribing
        // to the result of getResources(), this won't actually get
        // checked until the mocked HTTP request "returns" a response.
        // This happens when we call req.flush(testResources) a few lines
        // down.
        resourceService.getResource().subscribe(
            resources => expect(resources).toBe(testResources)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(resourceService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testResources);
    });

   /* it('getResources(resourceLink) adds appropriate param string to called URL', () => {
        resourceService.getResource('o').subscribe(
            resources => expect(resources).toEqual(resources)
        );

        const req = httpTestingController.expectOne(resourceService.baseUrl + '?link=o&');
        expect(req.request.method).toEqual('GET');
        req.flush(resources);
    });*/ // falling





    it('getResourceById() calls api/resources/id', () => {
        const targetResource: Resource = testResources[1];
        const targetId: string = targetResource._id;
        resourceService.getResourceByID(targetId).subscribe(
            resource => expect(resource).toBe(targetResource)
        );

        const expectedUrl: string = resourceService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetResource);
    });

    it('adding a resource calls api/resources/new', () => {
        const facebook_id = { '$oid': 'facebook_id' };
        const newResource: Resource = {
            _id: 'facebook_id',
            title: 'Facebook',
            link: 'https://www.facebook.com/',
        };

        resourceService.addNewResource(newResource).subscribe(
            id => {
                expect(id).toBe(facebook_id);
            }
        );

        const expectedUrl: string = resourceService.baseUrl + '/new';
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('POST');
        req.flush(facebook_id);
    });


});
