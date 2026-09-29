describe('Benchmark thị trường (dữ liệu mô phỏng)', () => {
  it('API trả về 4 benchmark có xu hướng 50 và 200 ngày', () => {
    cy.request('POST', '/api/v1/auth/anonymous', {
      accessToken: 'demo-user-12'
    }).then(({ body }) => {
      cy.request({
        headers: { Authorization: `Bearer ${body.authToken}` },
        url: '/api/v1/benchmarks'
      }).then(({ body: { benchmarks } }) => {
        expect(benchmarks).to.have.length.of.at.least(4);

        for (const benchmark of benchmarks) {
          expect(benchmark.trend50d).to.not.equal('UNKNOWN');
          expect(benchmark.trend200d).to.not.equal('UNKNOWN');
        }
      });
    });
  });
});
