import urlcat from '../src';
import { expect } from 'chai';

describe('urlcat', () => {

  it('Concatenates the base URL and the path if no params are passed', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com', 'path');
    expect(actual).to.equal(expected);
  });

  it('Uses exactly one slash for joining even if the base URL has a trailing slash', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com/', 'path');
    expect(actual).to.equal(expected);
  });

  it('Uses exactly one slash for joining even if the path has a leading slash', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com', '/path');
    expect(actual).to.equal(expected);
  });

  it('Uses exactly one slash for joining even if the base URL and the path both have a slash at the boundary', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com/', '/path');
    expect(actual).to.equal(expected);
  });

  it('Substitutes path parameters', () => {
    const expected = 'http://example.com/path/1';
    const actual = urlcat('http://example.com/', '/path/:p', { p: 1 });
    expect(actual).to.equal(expected);
  });

  it('Allows path parameters at the beginning of the path', () => {
    const expected = 'http://example.com/1';
    const actual = urlcat('http://example.com/', ':p', { p: 1 });
    expect(actual).to.equal(expected);
  });

  it('Parameters that are missing from the path become query parameters', () => {
    const expected = 'http://example.com/path/1?q=2';
    const actual = urlcat('http://example.com/', '/path/:p', { p: 1, q: 2 });
    expect(actual).to.equal(expected);
  });

  it('Uses exactly one ? to join query parameters even if the path has a trailing question mark', () => {
    const expected = 'http://example.com/path?q=2';
    const actual = urlcat('http://example.com/', '/path?', { q: 2 });
    expect(actual).to.equal(expected);
  });

  it('Removes trailing question mark from the path if no params are specified', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com/', '/path?', {});
    expect(actual).to.equal(expected);
  });

  it('All parameters become query parameters if the path has no parameters', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com/', '/path?', {});
    expect(actual).to.equal(expected);
  });

  it('If a parameter appears twice in the path, it is substituted twice', () => {
    const expected = 'http://example.com/path/a/b/a/r';
    const actual = urlcat('http://example.com/', '/path/:p1/:p2/:p1/r', { p1: 'a', p2: 'b' });
    expect(actual).to.equal(expected);
  });

  it('Escapes both path and query parameters', () => {
    const expected = 'http://example.com/path/a%20b?q=b+c';
    const actual = urlcat('http://example.com/', '/path/:p', { p: 'a b', q: 'b c' });
    expect(actual).to.equal(expected);
  });

  it('Can handle complex URL\'s', () => {
    const expected = 'http://example.com/users/123/posts/987/comments?authorId=456&limit=10&offset=120';
    const actual = urlcat(
      'http://example.com/',
      '/users/:userId/posts/:postId/comments',
      { userId: 123, postId: 987, authorId: 456, limit: 10, offset: 120 }
    );
    expect(actual).to.equal(expected);
  });

  it('Provides an overload (baseUrl, pathTemplate) that works correctly', () => {
    const expected = 'http://example.com/path';
    const actual = urlcat('http://example.com/', '/path');
    expect(actual).to.equal(expected);
  });

  it('Handles "//" path correctly (reproduces #7)', () => {
    const expected = 'http://example.com//';
    const actual = urlcat('http://example.com/', '//');
    expect(actual).to.equal(expected);
  });

  it('Provides an overload (baseTemplate, params) that works correctly', () => {
    const expected = 'http://example.com/path/a%20b?q=b+c';
    const actual = urlcat('http://example.com/path/:p', { p: 'a b', q: 'b c' });
    expect(actual).to.equal(expected);
  });

  it('Can\'t handle null as param', () => {
    expect(() => urlcat('http://example.com/path/:p', { p: null }))
      .to.throw(TypeError, "Path parameter null is not Valid");
  });

  it('Can\'t handle null as second param', () => {
    expect(() => urlcat('http://example.com/path/:p/:q', { p: 'test', q: null }))
      .to.throw(TypeError, "Path parameter null is not Valid");
  });

  it('Can\'t handle undefined as param', () => {
    expect(() => urlcat('http://example.com/path/:p', { p: undefined }))
      .to.throw(TypeError, "Path parameter undefined is not Valid");
  });

  it('Can\'t handle missing as param', () => {
    expect(() => urlcat('http://example.com/path/:p', { p: "" }))
      .to.throw(TypeError, "Path parameter  is not Valid");
  });
});
